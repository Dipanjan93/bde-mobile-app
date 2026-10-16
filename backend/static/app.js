const API_BASE = "";
let currentRole = null; // 'owner' | 'staff'
let currentUserName = "";
let isAdmin = false;

function getStoredToken() {
  return localStorage.getItem('bde_auth_token') || '';
}

function getAuthHeaders() {
  const t = getStoredToken();
  return t ? { 'x-bde-auth': t, 'Authorization': `Bearer ${t}` } : {};
}

async function authFetch(url, options = {}, timeoutMs = 6000) {
  options.headers = options.headers || {};
  const t = getStoredToken();
  if (t) {
    options.headers['x-bde-auth'] = t;
    options.headers['Authorization'] = `Bearer ${t}`;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch(err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

let productsCache = [];
let customersCache = [];
let invoiceCart = [];
let historyCache = [];
let duesCache = [];

let monthlyChartInstance = null;
let locationChartInstance = null;
let categoryChartInstance = null;

const fmtInr = (n) => "₹ " + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* --- Floating Toast Notification Engine --- */
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(container);
  }

  const colors = {
    success: { border: "#10b981", bg: "rgba(6, 78, 59, 0.92)", icon: "✅" },
    warning: { border: "#f59e0b", bg: "rgba(120, 53, 15, 0.92)", icon: "⚠️" },
    error:   { border: "#f43f5e", bg: "rgba(136, 19, 55, 0.92)", icon: "❌" },
    info:    { border: "#fbbf24", bg: "rgba(22, 27, 34, 0.95)", icon: "🪵" }
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement("div");
  toast.style.cssText = `
    display: flex; align-items: center; gap: 10px;
    background: ${c.bg}; color: #f8fafc;
    border-left: 4px solid ${c.border};
    border-top: 1px solid rgba(255,255,255,0.12);
    border-right: 1px solid rgba(255,255,255,0.12);
    border-bottom: 1px solid rgba(255,255,255,0.12);
    padding: 12px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 15px 30px -5px rgba(0,0,0,0.5);
    backdrop-filter: blur(12px);
    transform: translateY(15px); opacity: 0;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 380px;
  `;
  toast.innerHTML = `<span>${c.icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(10px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 250);
  }, 3400);
}

/* --- Quick Copy Helper --- */
function copyText(text, label = "Text") {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label}: ${text}`, "info");
  });
}

/* --- Indian Number to Words (For Printable Cash Memo) --- */
function numberToIndianWords(num) {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return "Rupees Zero Only";
  const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
  const b = ["", "", "Twenty ", "Thirty ", "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety "];

  const inWords = (val) => {
    if (val < 20) return a[val];
    return b[Math.floor(val / 10)] + a[val % 10];
  };

  let str = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n / 100000) % 100);
  const thousand = Math.floor((n / 1000) % 100);
  const hundred = Math.floor((n / 100) % 10);
  const rest = n % 100;

  if (crore > 0) str += inWords(crore) + "Crore ";
  if (lakh > 0) str += inWords(lakh) + "Lakh ";
  if (thousand > 0) str += inWords(thousand) + "Thousand ";
  if (hundred > 0) str += inWords(hundred) + "Hundred ";
  if (rest > 0) {
    if (str !== "") str += "and ";
    str += inWords(rest);
  }
  return "Rupees " + str.trim() + " Only";
}

/* --- Theme Switcher --- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('bde_theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Day Mode';
}

function toggleTheme() {
  const cur = localStorage.getItem('bde_theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(`Switched to ${next === 'light' ? 'Day' : 'Dark'} Mode`, "info");
}

/* --- Showroom Staff & Manager Security Gate Engine --- */
function toggleGatePinVisibility() {
  const pinInput = document.getElementById('gatePinInput');
  if (!pinInput) return;
  pinInput.type = pinInput.type === 'password' ? 'text' : 'password';
}

async function handleConsoleLogin(e) {
  if (e) e.preventDefault();
  const pinInput = document.getElementById('gatePinInput');
  const errEl = document.getElementById('gateErrorMsg');
  const card = document.getElementById('authGateCard');
  const remember = document.getElementById('gateRememberMe')?.checked ?? true;
  const pin = (pinInput?.value || "").trim();

  if (!pin) {
    if (errEl) {
      errEl.textContent = "Please enter your security passcode.";
      errEl.classList.add('show');
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/staff/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: pin, remember })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.detail || "Incorrect security passcode.";
      if (errEl) {
        errEl.textContent = `❌ ${msg}`;
        errEl.classList.add('show');
      }
      if (card) {
        card.classList.remove('shake-anim');
        void card.offsetWidth;
        card.classList.add('shake-anim');
      }
      if (pinInput) {
        pinInput.value = "";
        pinInput.focus();
      }
      return;
    }

    const data = await res.json();
    localStorage.setItem('bde_auth_token', data.token);
    localStorage.setItem('bde_auth_role', data.role);
    localStorage.setItem('bde_auth_name', data.name);

    if (errEl) errEl.classList.remove('show');
    showToast(`Access granted! Welcome, ${data.name}.`, "success");
    unlockConsoleUI(data.role, data.name);
  } catch (err) {
    if (errEl) {
      errEl.textContent = "Network error connecting to auth server.";
      errEl.classList.add('show');
    }
  }
}

function unlockConsoleUI(role, name) {
  currentRole = role;
  currentUserName = name;
  isAdmin = (role === 'owner');

  const gate = document.getElementById('consoleAuthGate');
  const app = document.getElementById('consoleApp');
  const badge = document.getElementById('sessionUserBadge');
  const lockBtn = document.getElementById('lockConsoleBtn');
  const authBtn = document.getElementById('authBtn');

  if (gate) gate.style.display = 'none';
  if (app) app.style.display = 'block';

  if (badge) {
    badge.style.display = 'inline-flex';
    badge.textContent = role === 'owner' ? `👑 ${name}` : `👨‍💼 ${name}`;
  }
  if (lockBtn) lockBtn.style.display = 'inline-flex';

  if (isAdmin) {
    document.body.classList.add('admin-unlocked');
    if (authBtn) {
      authBtn.textContent = "🔓 Admin Active (Lock)";
      authBtn.classList.replace('btn-secondary', 'btn-danger');
    }
  } else {
    document.body.classList.remove('admin-unlocked');
    if (authBtn) {
      authBtn.textContent = "🔒 Staff Mode (Unlock Admin)";
      authBtn.classList.replace('btn-danger', 'btn-secondary');
    }
  }

  // Load store data now that session is authenticated
  loadCustomers();
  loadInventory();
  loadSalesHistory();
  loadDues();
  loadWebsiteInquiries();
  if (!window._inquiriesInterval) {
    window._inquiriesInterval = setInterval(loadWebsiteInquiries, 25000);
  }
  if (isAdmin) {
    loadExecutiveBI();
  }
}

async function checkConsoleAuth() {
  const token = getStoredToken();
  if (!token) {
    const gate = document.getElementById('consoleAuthGate');
    const app = document.getElementById('consoleApp');
    if (gate) gate.style.display = 'flex';
    if (app) app.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-session`, {
      headers: { 'x-bde-auth': token }
    });
    const data = await res.json();
    if (data.authenticated) {
      unlockConsoleUI(data.role, data.name);
    } else {
      localStorage.removeItem('bde_auth_token');
      localStorage.removeItem('bde_auth_role');
      localStorage.removeItem('bde_auth_name');
      const gate = document.getElementById('consoleAuthGate');
      const app = document.getElementById('consoleApp');
      if (gate) gate.style.display = 'flex';
      if (app) app.style.display = 'none';
    }
  } catch (e) {
    const role = localStorage.getItem('bde_auth_role');
    const name = localStorage.getItem('bde_auth_name') || 'Staff';
    if (token && role) {
      unlockConsoleUI(role, name);
    } else {
      const gate = document.getElementById('consoleAuthGate');
      const app = document.getElementById('consoleApp');
      if (gate) gate.style.display = 'flex';
      if (app) app.style.display = 'none';
    }
  }
}

async function logoutConsole() {
  try {
    await fetch(`${API_BASE}/api/auth/console-logout`, { method: "POST" });
  } catch (e) {}
  localStorage.removeItem('bde_auth_token');
  localStorage.removeItem('bde_auth_role');
  localStorage.removeItem('bde_auth_name');
  isAdmin = false;
  currentRole = null;
  document.body.classList.remove('admin-unlocked');

  const gate = document.getElementById('consoleAuthGate');
  const app = document.getElementById('consoleApp');
  if (app) app.style.display = 'none';
  if (gate) {
    gate.style.display = 'flex';
    const pinInput = document.getElementById('gatePinInput');
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }
  showToast("Console locked. Terminal secured.", "info");
}

/* --- Admin PIN Security (For Staff Mode Upgrade) --- */
function handleAuthClick() {
  if (isAdmin) {
    isAdmin = false;
    document.body.classList.remove('admin-unlocked');
    document.getElementById('authBtn').textContent = "🔒 Staff Mode (Unlock Admin)";
    document.getElementById('authBtn').classList.replace('btn-danger', 'btn-secondary');
    switchTab('pos');
    onProductSelectChange();
    showToast("Admin Mode Locked. Switched to Counter Staff View.", "info");
  } else {
    document.getElementById('pinInput').value = "";
    document.getElementById('pinModal').classList.add('show');
    setTimeout(() => document.getElementById('pinInput').focus(), 100);
  }
}

function closePinModal() { document.getElementById('pinModal').classList.remove('show'); }

async function verifyPin() {
  const pinInput = document.getElementById('pinInput');
  const pinVal = (pinInput ? pinInput.value : "").trim();
  if (!pinVal) {
    showToast("Please enter security passcode", "warning");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/staff/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: pinVal, remember: true })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      showToast(errData.detail || "Incorrect Security Passcode", "error");
      if (pinInput) {
        pinInput.value = "";
        pinInput.focus();
      }
      return;
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('bde_auth_token', data.token);
      localStorage.setItem('bde_auth_role', data.role);
      localStorage.setItem('bde_auth_name', data.name);
    }

    if (data.role === 'owner') {
      isAdmin = true;
      document.body.classList.add('admin-unlocked');
      document.getElementById('authBtn').textContent = "🔓 Admin Active (Lock)";
      document.getElementById('authBtn').classList.replace('btn-secondary', 'btn-danger');
      const badge = document.getElementById('sessionUserBadge');
      if (badge) badge.textContent = `👑 ${data.name}`;
      closePinModal();
      onProductSelectChange();
      renderRates(productsCache);
      renderHistory(historyCache);
      loadExecutiveBI();
      showToast("Admin Mode Unlocked! Full Margins & BI Active.", "success");
    } else {
      isAdmin = false;
      document.body.classList.remove('admin-unlocked');
      document.getElementById('authBtn').textContent = "🔒 Staff Active (Unlock Admin)";
      document.getElementById('authBtn').classList.replace('btn-danger', 'btn-secondary');
      const badge = document.getElementById('sessionUserBadge');
      if (badge) badge.textContent = `👤 ${data.name}`;
      closePinModal();
      showToast("Staff Access Verified. Counter View Active.", "info");
    }
  } catch (err) {
    showToast("Server connection error during verification", "error");
  }
}

/* --- Tab Navigation --- */
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(name));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`tab-${name}`);
  if (panel) panel.classList.add('active');

  if (name === 'inventory') renderInventory(productsCache);
  if (name === 'rates') renderRates(productsCache);
  if (name === 'broadcast') renderBroadcastList();
  if (name === 'exec') loadExecutiveBI();
  if (name === 'dues') loadDues();
  if (name === 'history') loadSalesHistory();
  if (name === 'inquiries') loadWebsiteInquiries();
}

/* --- Inventory & Products --- */
async function loadInventory() {
  if ((!productsCache || productsCache.length === 0) && window.BDE_OFFLINE_CATALOG) {
    productsCache = window.BDE_OFFLINE_CATALOG;
    populateCategoryDropdown();
    renderInventory(productsCache);
    renderRates(productsCache);
    populateDropdowns();
  }
  try {
    const res = await authFetch(`${API_BASE}/products`);
    productsCache = await res.json();
    populateCategoryDropdown();
    renderInventory(productsCache);
    renderRates(productsCache);
    populateDropdowns();
  } catch(e) {
    console.warn("Could not fetch inventory live, checking offline fallback", e);
    if ((!productsCache || productsCache.length === 0) && window.BDE_OFFLINE_CATALOG) {
      productsCache = window.BDE_OFFLINE_CATALOG;
      populateCategoryDropdown();
      renderInventory(productsCache);
      renderRates(productsCache);
      populateDropdowns();
    }
  }
}

function populateCategoryDropdown() {
  const cats = Array.from(new Set(productsCache.map(p => p.category || "General"))).sort();
  const sel = document.getElementById('invCategoryFilter');
  if (!sel) return;
  const curVal = sel.value || "ALL";
  sel.innerHTML = `<option value="ALL">All Categories</option>` + cats.map(c => `<option value="${c}">${c}</option>`).join('');
  sel.value = curVal;
}

function renderInventory(list) {
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;
  let totalUnits = 0, totalVal = 0, lowStockCount = 0;

  list.forEach(p => {
    totalUnits += (p.stock_qty || 0);
    totalVal += (p.inventory_valuation || 0);
    if ((p.stock_qty || 0) <= (p.reorder_level || 0)) {
      lowStockCount++;
    }
  });

  document.getElementById('invTotalSkus').textContent = list.length;
  document.getElementById('invTotalUnits').textContent = totalUnits.toLocaleString('en-IN');
  document.getElementById('invTotalValuation').textContent = fmtInr(totalVal);
  document.getElementById('invLowStockAlerts').textContent = lowStockCount;

  tbody.innerHTML = list.map(p => {
    let statusBadge = '';
    let barColor = 'var(--emerald)';
    const stock = p.stock_qty || 0;
    const reorder = p.reorder_level || 1;
    const maxCap = Math.max(stock, reorder * 4, 1);
    const pct = Math.min(100, Math.max(4, Math.round((stock / maxCap) * 100)));

    if (stock <= 0) {
      statusBadge = '<span class="badge-nostock">NO STOCK</span>';
      barColor = 'var(--rose)';
    } else if (stock <= reorder) {
      statusBadge = '<span class="badge-lowstock">LOW STOCK (&le;25%)</span>';
      barColor = 'var(--amber)';
    } else {
      statusBadge = '<span class="badge-instock">IN STOCK</span>';
    }

    return `
      <tr>
        <td class="mono" style="font-weight:700; color:var(--primary); cursor:pointer;" title="Click to copy SKU" onclick="copyText('${p.sku}', 'SKU')">${p.sku}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.subcategory || 'General'}</td>
        <td>${p.brand || 'Standard'}</td>
        <td>${p.unit || 'Pcs'}</td>
        <td class="mono" style="text-align:right;">${p.opening_qty}</td>
        <td class="mono" style="text-align:right;">${p.total_restocked}</td>
        <td class="mono" style="text-align:right;">${p.total_sold}</td>
        <td class="mono" style="text-align:right; font-weight:800; font-size:13px; min-width:95px;">
          <div>${stock}</div>
          <div style="width:100%; height:4px; background:rgba(148,163,184,0.18); border-radius:99px; margin-top:4px; overflow:hidden;">
            <div style="width:${stock <= 0 ? 0 : pct}%; height:100%; background:${barColor}; border-radius:99px;"></div>
          </div>
        </td>
        <td class="mono" style="text-align:center;">${p.reorder_level}</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td class="mono" style="text-align:right; font-weight:700;">${fmtInr(p.inventory_valuation)}</td>
      </tr>
    `;
  }).join('');
}

function filterInventory() {
  const q = document.getElementById('invSearch').value.toLowerCase();
  const cat = document.getElementById('invCategoryFilter').value;
  const filtered = productsCache.filter(p => {
    const matchText = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q));
    const matchCat = (cat === 'ALL') || (p.category === cat);
    return matchText && matchCat;
  });
  renderInventory(filtered);
}

/* --- Rate Chart --- */
function renderRates(list) {
  const tbody = document.getElementById('rateChartBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(p => `
    <tr>
      <td class="mono" style="font-weight:700; color:var(--primary); cursor:pointer;" title="Click to copy SKU" onclick="copyText('${p.sku}', 'SKU')">${p.sku}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${p.unit}</td>
      <td class="mono admin-only" style="text-align:right; font-weight:700; color:var(--text-muted);">${fmtInr(p.purchase_price)}</td>
      <td class="mono" style="text-align:right; font-weight:700; color:var(--primary); cursor:pointer;" title="Click to copy Selling Price" onclick="copyText('${p.selling_price}', 'Rate')">${fmtInr(p.selling_price)}</td>
      <td class="mono admin-only" style="text-align:right; color:var(--amber);">${fmtInr(p.min_selling_price)}</td>
      <td class="mono admin-only" style="text-align:right; color:${p.gross_margin_pct >= 0 ? 'var(--emerald)' : 'var(--rose)'}; font-weight:700;">${p.gross_margin_pct}%</td>
    </tr>
  `).join('');
}

function filterRates() {
  const q = document.getElementById('rateSearch').value.toLowerCase();
  const filtered = productsCache.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  renderRates(filtered);
}

/* --- Customers & POS Dropdowns --- */
async function loadCustomers() {
  const res = await authFetch(`${API_BASE}/customers`);
  customersCache = await res.json();
  populateDropdowns();
}

function populateDropdowns() {
  const custSelect = document.getElementById('posCustomerSelect');
  if (custSelect) {
    const prevCust = custSelect.value;
    custSelect.innerHTML = customersCache.map(c => `
      <option value="${c.id}">${c.name} (${c.phone}) — [${c.category || 'Retailer'}]</option>
    `).join('');
    if (prevCust) custSelect.value = prevCust;
  }

  const posProd = document.getElementById('posProductSelect');
  const purProd = document.getElementById('purProductSelect');
  const opts = productsCache.map(p => `<option value="${p.id}">${p.name} (${p.sku}) — [Stock: ${p.stock_qty} ${p.unit}]</option>`).join('');
  if (posProd) posProd.innerHTML = opts;
  if (purProd) purProd.innerHTML = opts;
  onPurProductChange();
  onProductSelectChange();
}

function onProductSelectChange() {
  const prodSelect = document.getElementById('posProductSelect');
  if (!prodSelect) return;
  const prodId = parseInt(prodSelect.value);
  const prod = productsCache.find(p => p.id === prodId);
  if (!prod) return;

  const formatRate = (val) => Number((parseFloat(val) || 0).toFixed(2));
  const sellPrice = formatRate(prod.selling_price);
  const floorMin = formatRate(prod.min_selling_price);
  const costPrice = formatRate(prod.purchase_price);

  document.getElementById('posRate').value = sellPrice;

  const helperEl = document.getElementById('priceHelper');
  if (helperEl) {
    helperEl.innerHTML = isAdmin
      ? `🏷️ <strong>Selling (S):</strong> ₹${sellPrice} &nbsp;|&nbsp; 🛡️ <strong>Floor Min (MS):</strong> ₹${floorMin} &nbsp;|&nbsp; 🔒 <strong>Cost (P):</strong> ₹${costPrice} &nbsp;|&nbsp; 📦 <strong>Available:</strong> ${prod.stock_qty} ${prod.unit}`
      : `🏷️ <strong>Standard Rate:</strong> ₹${sellPrice} per ${prod.unit} &nbsp;|&nbsp; 📦 <strong>Available Stock:</strong> ${prod.stock_qty} ${prod.unit}`;
  }

  const sheetInput = document.getElementById('posSheets');
  const qtyInput = document.getElementById('posQty');

  if (prod.unit === 'SqFt' && (prod.sqft_per_piece || 0) > 0) {
    sheetInput.style.display = 'block';
    sheetInput.placeholder = `Sheets (${prod.sqft_per_piece} SqFt/sheet)`;
    sheetInput.value = '';
    qtyInput.placeholder = "Total SqFt";
  } else {
    sheetInput.style.display = 'none';
    sheetInput.value = '';
    qtyInput.placeholder = `Billing Qty (${prod.unit})`;
  }
}

function calcPlywoodSqft() {
  const prodId = parseInt(document.getElementById('posProductSelect').value);
  const prod = productsCache.find(p => p.id === prodId);
  const sheets = parseFloat(document.getElementById('posSheets').value) || 0;
  if (prod && prod.sqft_per_piece > 0) {
    document.getElementById('posQty').value = Number((sheets * prod.sqft_per_piece).toFixed(2));
  }
}

function addItemToCart() {
  const prodId = parseInt(document.getElementById('posProductSelect').value);
  const prod = productsCache.find(p => p.id === prodId);
  const qty = parseFloat(document.getElementById('posQty').value);
  const rate = parseFloat(document.getElementById('posRate').value);

  if (!qty || qty <= 0 || !rate || rate <= 0) {
    return showToast("Please enter a valid Billing Quantity and Unit Rate.", "warning");
  }
  if (qty > prod.stock_qty) {
    return showToast(`Insufficient Stock! Only ${prod.stock_qty} ${prod.unit} available for ${prod.name}.`, "error");
  }

  const existing = invoiceCart.find(item => item.product_id === prodId);
  if (existing) {
    if (existing.qty + qty > prod.stock_qty) {
      return showToast(`Cannot exceed available stock (${prod.stock_qty} ${prod.unit}).`, "error");
    }
    existing.qty = Number((existing.qty + qty).toFixed(2));
    existing.unit_price = rate;
    existing.total = existing.qty * rate;
  } else {
    invoiceCart.push({
      product_id: prodId,
      name: prod.name,
      sku: prod.sku,
      unit: prod.unit,
      qty: qty,
      unit_price: rate,
      total: qty * rate
    });
  }

  document.getElementById('posQty').value = '';
  document.getElementById('posSheets').value = '';
  const searchBox = document.getElementById('posProdSearch');
  if (searchBox) { searchBox.value = ''; filterPosProducts(); }
  renderCart();
  showToast(`Added ${qty} ${prod.unit} of ${prod.name} to bill`, "success");
}

function removeFromCart(idx) {
  const removed = invoiceCart.splice(idx, 1);
  renderCart();
  if (removed.length) showToast(`Removed ${removed[0].name} from cart`, "info");
}

function renderCart() {
  const tbody = document.getElementById('cartBody');
  if (invoiceCart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 28px;">No items in bill yet. Select a product on the left to begin.</td></tr>`;
    document.getElementById('cartGrandTotal').textContent = "₹ 0.00";
    return;
  }

  let grand = 0;
  tbody.innerHTML = invoiceCart.map((item, idx) => {
    grand += item.total;
    return `
      <tr>
        <td class="mono">${idx + 1}</td>
        <td>
          <strong>${item.name}</strong>
          <div class="mono" style="font-size:11px; color:var(--text-muted);">${item.sku || ''}</div>
        </td>
        <td class="mono">${item.qty} ${item.unit}</td>
        <td class="mono">${fmtInr(item.unit_price)}</td>
        <td class="mono"><strong>${fmtInr(item.total)}</strong></td>
        <td style="text-align: right;">
          <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px;" onclick="removeFromCart(${idx})">✕</button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('cartGrandTotal').textContent = fmtInr(grand);
}

async function finalizeMultiItemSale() {
  if (invoiceCart.length === 0) return showToast("Invoice cart is empty! Add items first.", "warning");
  const custId = parseInt(document.getElementById('posCustomerSelect').value);
  if (!custId) return showToast("Please select a customer first.", "warning");

  const paidInput = document.getElementById('posPaidAmount').value.trim();
  const paidAmount = paidInput === "" ? null : parseFloat(paidInput);

  const payload = {
    customer_id: custId,
    paid_amount: paidAmount,
    items: invoiceCart.map(item => ({
      product_id: item.product_id,
      qty: item.qty,
      unit_price: item.unit_price
    }))
  };

  const res = await authFetch(`${API_BASE}/sales/multi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    return showToast(err.detail || "Sale transaction rejected.", "error");
  }

  const receipt = await res.json();
  showToast(`Invoice ${receipt.invoice_id} finalized! Preparing print...`, "success");

  invoiceCart = [];
  document.getElementById('posPaidAmount').value = "";
  renderCart();

  await loadInventory();
  loadSalesHistory();
  loadDues();
  if (isAdmin) loadExecutiveBI();

  renderBillForPrinting(receipt);
}

/* --- Render Printable Cash Memo with Cashback QR Code --- */
function renderBillForPrinting(receipt) {
  document.getElementById('billInv').textContent = receipt.invoice_id;
  document.getElementById('billDate').textContent = receipt.date;
  document.getElementById('billCust').textContent = receipt.customer_name;
  document.getElementById('billPhone').textContent = receipt.customer_phone;

  if (Array.isArray(receipt.items)) {
    document.getElementById('billItemsBody').innerHTML = receipt.items.map(i => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #000;">${i.name}</td>
        <td style="padding: 6px 10px; text-align: right; border: 1px solid #000;">${i.qty} ${i.unit}</td>
        <td style="padding: 6px 10px; text-align: right; border: 1px solid #000;">₹ ${Number(i.unit_price).toFixed(2)}</td>
        <td style="padding: 6px 10px; text-align: right; border: 1px solid #000;">₹ ${Number(i.line_total).toFixed(2)}</td>
      </tr>
    `).join('');
  } else {
    document.getElementById('billItemsBody').innerHTML = `
      <tr>
        <td colspan="4" style="padding: 6px 10px; border: 1px solid #000;">${receipt.items_detail || 'Materials & Hardware items'}</td>
      </tr>
    `;
  }

  document.getElementById('billGrandTotal').textContent = fmtInr(receipt.grand_total || receipt.total_amount);
  document.getElementById('billPaid').textContent = fmtInr(receipt.paid_amount);
  document.getElementById('billDue').textContent = fmtInr(receipt.due_amount);

  const wordsEl = document.getElementById('billAmountWords');
  if (wordsEl) {
    wordsEl.textContent = "Amount in Words: " + numberToIndianWords(receipt.grand_total || receipt.total_amount);
  }

  // Generate Dynamic QR Code for Customer Cashback & Finished Furniture Upload
  const qrUrl = `https://bde-mobile-app.onrender.com/?tab=showcase&inv=${encodeURIComponent(receipt.invoice_id)}&phone=${encodeURIComponent(receipt.customer_phone || '')}&name=${encodeURIComponent(receipt.customer_name || '')}`;
  
  const linkTextEl = document.getElementById('billCashbackLinkText');
  if (linkTextEl) linkTextEl.textContent = qrUrl;

  const qrBox = document.getElementById('billQrCodeBox');
  if (qrBox) {
    qrBox.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(qrBox, {
          text: qrUrl,
          width: 86,
          height: 86,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}" style="width:100%; height:100%; object-fit:contain;" />`;
      }
    } else {
      qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}" style="width:100%; height:100%; object-fit:contain;" />`;
    }
  }

  document.body.classList.remove('printing-restock');
  document.body.classList.add('printing-bill');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-bill');
  }, 1000);
}

function reprintInvoice(invoiceId) {
  const inv = historyCache.find(x => x.invoice_id === invoiceId);
  if (!inv) {
    showToast(`Invoice ${invoiceId} not found in register.`, "error");
    return;
  }
  showToast(`Preparing Cash Memo print with QR Code for ${invoiceId}...`, "info");
  renderBillForPrinting({
    invoice_id: inv.invoice_id,
    date: inv.date,
    customer_name: inv.customer_name,
    customer_phone: inv.customer_phone,
    items_detail: inv.items_detail,
    grand_total: inv.total_amount,
    paid_amount: inv.paid_amount,
    due_amount: inv.due_amount
  });
}

/* --- Khata / Due Ledger --- */
async function loadDues() {
  try {
    const res = await authFetch(`${API_BASE}/dues/summary`);
    duesCache = await res.json();
    renderDues(duesCache);
  } catch(e) { console.error(e); }
}

function renderDues(list) {
  const tbody = document.getElementById('duesBody');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:var(--emerald); padding:24px; font-weight:700;">🎉 All clear! Zero outstanding customer receivables.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(d => {
    const catClass = d.category === 'Carpenter' ? 'badge-carpenter' : (d.category === 'Contractor' ? 'badge-contractor' : 'badge-retailer');
    return `
      <tr>
        <td><strong>${d.customer_name}</strong></td>
        <td><span class="badge-cat ${catClass}">${d.category}</span></td>
        <td class="mono">${d.phone}</td>
        <td>${d.location}</td>
        <td class="mono" style="text-align:right;">${fmtInr(d.total_billed)}</td>
        <td class="mono" style="color:var(--emerald); text-align:right;">${fmtInr(d.total_paid)}</td>
        <td class="mono" style="color:var(--rose); font-weight:800; text-align:right;">${fmtInr(d.pending_due)}</td>
        <td class="mono" style="text-align:center;">${d.oldest_due_date}</td>
        <td class="mono" style="text-align:center; color:var(--amber); font-weight:700;">${d.overdue_days} days</td>
        <td style="text-align:right;">
          <button class="btn btn-secondary" style="padding: 5px 12px; font-size: 11.5px;" onclick="openPaymentModal(${d.customer_id}, '${d.customer_name}', ${d.pending_due})">
            💳 Receive Payment
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterDues() {
  const q = document.getElementById('dueSearch').value.toLowerCase();
  renderDues(duesCache.filter(d => d.customer_name.toLowerCase().includes(q) || d.phone.includes(q)));
}

function openPaymentModal(custId, custName, due) {
  document.getElementById('payCustId').value = custId;
  document.getElementById('payModalSubtitle').textContent = `Customer: ${custName} | Outstanding Due: ₹ ${due}`;
  document.getElementById('payAmountInput').value = due;
  document.getElementById('paymentModal').classList.add('show');
  setTimeout(() => document.getElementById('payAmountInput').focus(), 100);
}

function closePaymentModal() { document.getElementById('paymentModal').classList.remove('show'); }

async function submitDuePayment() {
  const custId = parseInt(document.getElementById('payCustId').value);
  const amount = parseFloat(document.getElementById('payAmountInput').value);
  if (!amount || amount <= 0) return showToast("Enter a valid payment sum.", "warning");

  const res = await authFetch(`${API_BASE}/dues/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_id: custId, amount: amount })
  });
  if (!res.ok) return showToast("Payment logging failed.", "error");

  closePaymentModal();
  showToast(`Received ₹${amount}! Customer Khata updated.`, "success");
  loadDues();
  loadSalesHistory();
  if (isAdmin) loadExecutiveBI();
}

/* --- WhatsApp Broadcast --- */
function insertTemplate(type) {
  const area = document.getElementById('broadcastMessage');
  if (type === 'stock') {
    area.value = "নমস্কার! বাবা দুগ্ধেশ্বর এন্টারপ্রাইজ (ওন্দা)-এ নতুন প্রিমিয়াম প্লাইউড, সানমাইকা এবং হার্ডওয়্যার স্টক এসেছে। আপনার প্রয়োজনে দোকানে আসুন বা কল করুন!";
  } else if (type === 'rates') {
    area.value = "🌟 Special Offer at Baba Dugdheswar Enterprise (Onda)! Best wholesale rates on Commercial & Marine Plywood, Fevicol, and Door Fittings this week.";
  } else if (type === 'due') {
    area.value = "নমস্কার, বাবা দুগ্ধেশ্বর এন্টারপ্রাইজ (ওন্দা) থেকে আপনার খাতার বকেয়া বিল পরিশোধ করার জন্য বিনীত অনুরোধ জানানো হচ্ছে। ধন্যবাদ!";
  }
  renderBroadcastList();
  showToast("Template inserted!", "info");
}

function renderBroadcastList() {
  const filter = document.getElementById('broadcastTargetFilter').value;
  const tbody = document.getElementById('broadcastListBody');
  const msg = encodeURIComponent(document.getElementById('broadcastMessage').value || "নমস্কার! বাবা দুগ্ধেশ্বর এন্টারপ্রাইজ (ওন্দা) থেকে শুভেচ্ছা।");

  let list = customersCache;
  if (filter !== 'ALL') {
    list = customersCache.filter(c => c.category === filter);
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted)">No customer contacts found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => {
    const cleanPhone = c.phone.replace(/[^0-9]/g, '');
    const waLink = `https://wa.me/91${cleanPhone}?text=${msg}`;
    const catClass = c.category === 'Carpenter' ? 'badge-carpenter' : (c.category === 'Contractor' ? 'badge-contractor' : 'badge-retailer');
    return `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge-cat ${catClass}">${c.category || 'Retailer'}</span></td>
        <td class="mono">${c.phone}</td>
        <td>${c.address || 'Onda'}</td>
        <td style="text-align:right;">
          <a href="${waLink}" target="_blank" class="btn btn-whatsapp" style="text-decoration:none; padding:5px 12px; font-size:11.5px; display:inline-flex;">
            💬 Send WhatsApp
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

/* --- Sales History --- */
async function loadSalesHistory() {
  try {
    const res = await authFetch(`${API_BASE}/invoices/history`);
    historyCache = await res.json();
    renderHistory(historyCache);
  } catch(e) { console.error(e); }
}

function renderHistory(list) {
  const tbody = document.getElementById('historyBody');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:var(--text-muted)">No finalized sales yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(inv => {
    const catClass = inv.customer_category === 'Carpenter' ? 'badge-carpenter' : (inv.customer_category === 'Contractor' ? 'badge-contractor' : 'badge-retailer');
    return `
      <tr>
        <td class="mono" style="color:var(--primary); font-weight:700;">${inv.invoice_id}</td>
        <td>${inv.date}</td>
        <td>
          <strong>${inv.customer_name}</strong>
          <div class="mono" style="font-size:11px; color:var(--text-muted);">${inv.customer_phone}</div>
        </td>
        <td><span class="badge-cat ${catClass}">${inv.customer_category}</span></td>
        <td style="max-width:290px; font-size:12px; color:var(--text-muted);">${inv.items_detail}</td>
        <td class="mono" style="text-align:right;"><strong>${fmtInr(inv.total_amount)}</strong></td>
        <td class="mono" style="color:var(--emerald); text-align:right;">${fmtInr(inv.paid_amount)}</td>
        <td class="mono" style="color:${inv.due_amount > 0 ? 'var(--rose)' : 'var(--text-muted)'}; font-weight:700; text-align:right;">
          ${fmtInr(inv.due_amount)}
        </td>
        <td class="mono admin-only" style="color:var(--emerald); text-align:right; font-weight:700;">${fmtInr(inv.profit)}</td>
        <td class="mono admin-only" style="color:var(--primary); text-align:right;">${inv.margin_pct}%</td>
        <td style="text-align:center;">
          <button class="btn btn-secondary" style="padding:4px 9px; font-size:11px;" onclick="reprintInvoice('${inv.invoice_id}')" title="Print Cash Memo with QR Code">
            🖨️ Bill
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterHistory() {
  const q = document.getElementById('histSearch').value.toLowerCase();
  renderHistory(historyCache.filter(inv =>
    inv.invoice_id.toLowerCase().includes(q) ||
    inv.customer_name.toLowerCase().includes(q) ||
    inv.items_detail.toLowerCase().includes(q)
  ));
}

/* --- Executive BI --- */
async function loadExecutiveBI() {
  try {
    const res = await authFetch(`${API_BASE}/analytics/executive-summary`);
    const d = await res.json();

    // 1. Today's Counter Pulse (Galla)
    if (document.getElementById('biTodayRev')) {
      document.getElementById('biTodayRev').textContent = fmtInr(d.today_revenue);
      document.getElementById('biTodayCash').textContent = fmtInr(d.today_cash);
      document.getElementById('biTodayDue').textContent = fmtInr(d.today_due);
      document.getElementById('biTodayProfit').textContent = fmtInr(d.today_profit);
      document.getElementById('biTodayCount').textContent = `${d.today_invoices_count || 0} Invoices Today`;
    }

    // 2. Master Financial & Cash Realization KPIs
    document.getElementById('biTotalRevenue').textContent = fmtInr(d.total_revenue);
    if (document.getElementById('biTotalPaid')) {
      document.getElementById('biTotalPaid').textContent = fmtInr(d.total_paid);
      document.getElementById('biTotalDue').textContent = fmtInr(d.total_due);
      document.getElementById('biCollectionEff').textContent = `${d.collection_efficiency_pct}% Realized in Cash`;
    }
    document.getElementById('biMtdRev').textContent = fmtInr(d.mtd_revenue);
    document.getElementById('biMtdProfit').textContent = fmtInr(d.mtd_profit);
    document.getElementById('biYtdRev').textContent = fmtInr(d.ytd_revenue);
    document.getElementById('biYtdProfit').textContent = fmtInr(d.ytd_profit);
    document.getElementById('biGrossMargin').textContent = `${d.gross_margin_pct}%`;

    // 3. Buyer Segment Breakdown (Carpenter / Retailer / Contractor)
    const segTbody = document.getElementById('execSegmentBody');
    if (segTbody) {
      if (d.segment_breakdown && d.segment_breakdown.length > 0) {
        segTbody.innerHTML = d.segment_breakdown.map(s => {
          const catClass = s.segment === 'Carpenter' ? 'badge-carpenter' : (s.segment === 'Contractor' ? 'badge-contractor' : 'badge-retailer');
          return `
            <tr>
              <td><span class="badge-cat ${catClass}">${s.segment}</span></td>
              <td class="mono" style="text-align:center;">${s.orders}</td>
              <td class="mono" style="text-align:right; font-weight:700;">${fmtInr(s.revenue)}</td>
              <td class="mono" style="text-align:right; color:var(--emerald); font-weight:700;">${fmtInr(s.profit)}</td>
              <td class="mono" style="text-align:right; color:${s.due > 0 ? 'var(--rose)' : 'var(--text-muted)'}; font-weight:700;">${fmtInr(s.due)}</td>
              <td class="mono" style="text-align:right; color:var(--primary); font-weight:700;">${s.margin_pct}%</td>
            </tr>
          `;
        }).join('');
      } else {
        segTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No segment data yet.</td></tr>`;
      }
    }

    // 4. Top 10 Profit-Generating SKUs
    const topSkusTbody = document.getElementById('execTopSkusBody');
    if (topSkusTbody) {
      if (d.top_products && d.top_products.length > 0) {
        topSkusTbody.innerHTML = d.top_products.map(p => `
          <tr>
            <td>
              <strong>${p.name}</strong>
              <div class="mono" style="font-size:11px; color:var(--primary);">${p.sku}</div>
            </td>
            <td class="mono" style="text-align:right;">${p.qty_sold} ${p.unit}</td>
            <td class="mono" style="text-align:right;">${fmtInr(p.revenue)}</td>
            <td class="mono" style="text-align:right; color:var(--emerald); font-weight:800;">${fmtInr(p.profit)}</td>
            <td class="mono" style="text-align:right; color:var(--amber); font-weight:700;">${p.margin_pct}%</td>
          </tr>
        `).join('');
      } else {
        topSkusTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No product sales recorded yet.</td></tr>`;
      }
    }

    // 5. Dead Stock & Locked Capital Alert
    const deadBadge = document.getElementById('biDeadStockBadge');
    if (deadBadge) {
      deadBadge.textContent = `${d.dead_stock_count || 0} Unsold SKUs | Locked: ${fmtInr(d.dead_stock_capital)}`;
    }
    const deadTbody = document.getElementById('execDeadStockBody');
    if (deadTbody) {
      if (d.dead_stock_items && d.dead_stock_items.length > 0) {
        deadTbody.innerHTML = d.dead_stock_items.map(item => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              <div class="mono" style="font-size:11px; color:var(--text-muted);">${item.sku} (${item.brand})</div>
            </td>
            <td>${item.category}</td>
            <td class="mono" style="text-align:right;">${item.stock_qty} ${item.unit}</td>
            <td class="mono" style="text-align:right; color:var(--amber); font-weight:800;">${fmtInr(item.locked_capital)}</td>
          </tr>
        `).join('');
      } else {
        deadTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--emerald); font-weight:700;">🎉 Every stocked SKU has active sales! Zero dead capital.</td></tr>`;
      }
    }

    // Customer P&L Table
    const custTbody = document.getElementById('execCustPlBody');
    if (d.customer_pl && d.customer_pl.length > 0) {
      custTbody.innerHTML = d.customer_pl.map(r => {
        const catClass = r.category === 'Carpenter' ? 'badge-carpenter' : (r.category === 'Contractor' ? 'badge-contractor' : 'badge-retailer');
        return `
          <tr>
            <td><strong>${r.customer_name}</strong></td>
            <td><span class="badge-cat ${catClass}">${r.category}</span></td>
            <td class="mono">${r.phone}</td>
            <td class="mono">${r.orders_count}</td>
            <td class="mono" style="text-align:right;">${fmtInr(r.total_revenue)}</td>
            <td class="mono" style="text-align:right;">${fmtInr(r.total_cogs)}</td>
            <td class="mono" style="color:var(--emerald); font-weight:700; text-align:right;">${fmtInr(r.net_profit)}</td>
            <td class="mono" style="color:var(--primary); text-align:right;">${r.margin_pct}%</td>
          </tr>
        `;
      }).join('');
    } else {
      custTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No sales data available.</td></tr>`;
    }

    // Monthly Table
    const timeTbody = document.getElementById('execTimePlBody');
    if (d.monthly_trends && d.monthly_trends.length > 0) {
      timeTbody.innerHTML = d.monthly_trends.map(m => `
        <tr>
          <td><strong>${m.month}</strong></td>
          <td class="mono" style="text-align:right;">${fmtInr(m.revenue)}</td>
          <td class="mono" style="color:var(--emerald); font-weight:700; text-align:right;">${fmtInr(m.profit)}</td>
          <td class="mono" style="color:var(--primary); text-align:right;">${m.margin}%</td>
        </tr>
      `).join('');
    }

    // Chart 1: Monthly Revenue vs Profit
    if (d.monthly_trends && d.monthly_trends.length > 0) {
      const ctxMonthly = document.getElementById('monthlyChart').getContext('2d');
      if (monthlyChartInstance) monthlyChartInstance.destroy();
      monthlyChartInstance = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
          labels: d.monthly_trends.map(m => m.month),
          datasets: [
            {
              label: 'Revenue (₹)',
              data: d.monthly_trends.map(m => m.revenue),
              backgroundColor: 'rgba(245, 158, 11, 0.45)',
              borderColor: '#f59e0b',
              borderRadius: 6,
              borderWidth: 1.5
            },
            {
              label: 'Gross Profit (₹)',
              data: d.monthly_trends.map(m => m.profit),
              type: 'line',
              borderColor: '#10b981',
              backgroundColor: '#10b981',
              borderWidth: 2.5,
              tension: 0.35
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // Chart 2: Category Revenue vs Profit
    if (d.category_breakdown && d.category_breakdown.length > 0 && document.getElementById('categoryChart')) {
      const ctxCat = document.getElementById('categoryChart').getContext('2d');
      if (categoryChartInstance) categoryChartInstance.destroy();
      categoryChartInstance = new Chart(ctxCat, {
        type: 'bar',
        data: {
          labels: d.category_breakdown.map(c => c.category),
          datasets: [
            {
              label: 'Revenue (₹)',
              data: d.category_breakdown.map(c => c.revenue),
              backgroundColor: 'rgba(251, 191, 36, 0.45)',
              borderColor: '#fbbf24',
              borderRadius: 5,
              borderWidth: 1.5
            },
            {
              label: 'Net Profit (₹)',
              data: d.category_breakdown.map(c => c.profit),
              backgroundColor: 'rgba(18, 59, 93, 0.85)',
              borderColor: '#123b5d',
              borderRadius: 5,
              borderWidth: 1.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // Chart 3: Locality Distribution
    if (d.location_breakdown && d.location_breakdown.length > 0) {
      const ctxLoc = document.getElementById('locationChart').getContext('2d');
      if (locationChartInstance) locationChartInstance.destroy();
      locationChartInstance = new Chart(ctxLoc, {
        type: 'doughnut',
        data: {
          labels: d.location_breakdown.map(l => l.location),
          datasets: [{
            data: d.location_breakdown.map(l => l.revenue),
            backgroundColor: ['#123B5D', '#F59E0B', '#10B981', '#1E40AF', '#D97706', '#8B5CF6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } } }
        }
      });
    }
  } catch(e) { console.error("Error loading Executive BI", e); }
}

/* --- New Product & Inward Purchases --- */
function openNewProductModal() { document.getElementById('newProdModal').classList.add('show'); }
function closeNewProductModal() { document.getElementById('newProdModal').classList.remove('show'); }

async function saveNewProduct() {
  const payload = {
    sku: document.getElementById('npSku').value.trim(),
    name: document.getElementById('npName').value.trim(),
    category: document.getElementById('npCategory').value.trim(),
    subcategory: document.getElementById('npSubcategory').value.trim() || "General",
    brand: document.getElementById('npBrand').value.trim() || "Standard",
    unit: document.getElementById('npUnit').value,
    sqft_per_piece: parseFloat(document.getElementById('npSqft').value) || 0.0,
    purchase_price: parseFloat(document.getElementById('npPurchase').value) || 0.0,
    selling_price: parseFloat(document.getElementById('npSelling').value) || 0.0,
    min_selling_price: parseFloat(document.getElementById('npFloor').value) || 0.0,
    stock_qty: parseFloat(document.getElementById('npStock').value) || 0.0
  };
  if (!payload.sku || !payload.name || !payload.category || !payload.selling_price) {
    return showToast("Missing required fields (SKU, Name, Category, Selling Rate).", "warning");
  }
  const res = await authFetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    return showToast(err.detail || "Error registering product.", "error");
  }
  closeNewProductModal();
  showToast(`Product "${payload.name}" added to catalogue!`, "success");
  await loadInventory();
}

function onPurProductChange() {
  const sel = document.getElementById('purProductSelect');
  if (!sel) return;
  const prodId = parseInt(sel.value);
  const prod = productsCache.find(p => p.id === prodId);
  if (!prod) return;
  document.getElementById('purCost').value = prod.purchase_price || '';
  document.getElementById('purSellingRate').value = prod.selling_price || '';
}

function suggestSellingPrice() {
  const cost = parseFloat(document.getElementById('purCost').value) || 0;
  const currentSelling = parseFloat(document.getElementById('purSellingRate').value) || 0;
  if (cost > 0 && currentSelling < cost) {
    document.getElementById('purSellingRate').value = Math.round(cost * 1.10);
  }
}

async function submitPurchase() {
  const prodId = parseInt(document.getElementById('purProductSelect').value);
  const qty = parseFloat(document.getElementById('purQty').value);
  const unitCost = parseFloat(document.getElementById('purCost').value);
  const newSelling = parseFloat(document.getElementById('purSellingRate').value);
  const supplier = document.getElementById('purSupplier').value || "Mill Stock";

  if (!qty || !unitCost) return showToast("Please specify inward quantity and unit purchase cost.", "warning");

  const payload = {
    product_id: prodId,
    qty: qty,
    unit_cost: unitCost,
    new_selling_price: !isNaN(newSelling) && newSelling > 0 ? newSelling : null,
    supplier_name: supplier
  };

  try {
    const res = await authFetch(`${API_BASE}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return showToast("Failed to log inward purchase.", "error");
    
    showToast("Inward shipment logged! Stock & rates updated.", "success");
    document.getElementById('purQty').value = "";
    document.getElementById('purCost').value = "";
    document.getElementById('purSellingRate').value = "";
    document.getElementById('purSupplier').value = "";
    
    await loadInventory();
    if (isAdmin) loadExecutiveBI();
  } catch (err) {
    console.error(err);
    showToast("Error logging purchase.", "error");
  }
}

/* --- Customer Modal (Add & Edit) --- */
function openCustomerModal() {
  document.getElementById('editCustId').value = "";
  document.getElementById('custModalTitle').textContent = "👤 Add New Customer";
  document.getElementById('newCustName').value = "";
  document.getElementById('newCustPhone').value = "";
  document.getElementById('newCustAddr').value = "";
  document.getElementById('newCustCategory').value = "Retailer";
  document.getElementById('custModal').classList.add('show');
  setTimeout(() => document.getElementById('newCustName').focus(), 100);
}

function openEditCustomerModal(custIdOverride = null) {
  const custId = custIdOverride || parseInt(document.getElementById('posCustomerSelect')?.value);
  const cust = customersCache.find(c => c.id === custId);
  if (!cust) return showToast("Please select a customer first.", "warning");

  document.getElementById('editCustId').value = cust.id;
  document.getElementById('custModalTitle').textContent = `✏️ Edit Customer: ${cust.name}`;
  document.getElementById('newCustName').value = cust.name || "";
  document.getElementById('newCustPhone').value = (cust.phone && !cust.phone.startsWith("NA-")) ? cust.phone : "";
  document.getElementById('newCustAddr').value = cust.address || "Onda";
  document.getElementById('newCustCategory').value = cust.category || "Retailer";
  document.getElementById('custModal').classList.add('show');
  setTimeout(() => document.getElementById('newCustPhone').focus(), 100);
}

function closeCustomerModal() {
  document.getElementById('custModal').classList.remove('show');
}

async function saveCustomer(e) {
  if (e && e.preventDefault) e.preventDefault();
  const editId = document.getElementById('editCustId').value.trim();
  const name = document.getElementById('newCustName').value.trim();
  const phone = document.getElementById('newCustPhone').value.trim();
  const address = document.getElementById('newCustAddr').value.trim() || "Onda";
  const category = document.getElementById('newCustCategory').value || "Retailer";

  if (!name) return showToast("Please enter customer name.", "warning");

  const url = editId ? `/customers/${editId}` : "/customers";
  const method = editId ? "PUT" : "POST";

  try {
    const res = await authFetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name, phone, address, category })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorDetail = data && data.detail ? (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)) : ("Server returned status " + res.status);
      return showToast("Failed to save: " + errorDetail, "error");
    }
    closeCustomerModal();
    await loadCustomers();
    const posSelect = document.getElementById('posCustomerSelect');
    if (posSelect && data && data.id) posSelect.value = data.id;
    loadDues();
    loadSalesHistory();
    if (isAdmin) loadExecutiveBI();
    showToast(editId ? `Updated details for "${data.name}"!` : `Customer "${data.name}" added!`, "success");
  } catch (err) {
    showToast("Network error: " + err.message, "error");
  }
}

async function seedMasterCatalogue() {
  const res = await authFetch(`${API_BASE}/seed-catalogue`, { method: "POST" });
  const data = await res.json();
  showToast(data.message, "success");
  loadInventory();
}

/* --- Printable Restock PDF --- */
function generateRestockPdf() {
  const lowStockItems = productsCache.filter(p => (p.stock_qty || 0) <= (p.reorder_level || 0));
  if (lowStockItems.length === 0) {
    return showToast("All items are well-stocked above 25%! No restock needed.", "success");
  }

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  document.getElementById('restockDate').textContent = dateFormatted;
  document.getElementById('restockSkuCount').textContent = `${lowStockItems.length} SKUs`;

  lowStockItems.sort((a, b) => (a.stock_qty || 0) - (b.stock_qty || 0));

  const tbody = document.getElementById('restockTableBody');
  tbody.innerHTML = lowStockItems.map((item, idx) => {
    const isZero = (item.stock_qty || 0) <= 0;
    const rowBg = isZero ? 'background-color: #ffe4e6;' : '';
    return `
      <tr style="${rowBg}">
        <td style="padding: 6px 8px; border: 1px solid #000; text-align: center;">${idx + 1}</td>
        <td style="padding: 6px 8px; border: 1px solid #000; font-family: monospace; font-weight: bold;">${item.sku}</td>
        <td style="padding: 6px 8px; border: 1px solid #000;">
          <strong>${item.name}</strong>
          ${isZero ? '<span style="color: #b91c1c; font-weight: bold; margin-left: 6px;">[OUT OF STOCK]</span>' : ''}
        </td>
        <td style="padding: 6px 8px; border: 1px solid #000;">${item.brand || 'Standard'}</td>
        <td style="padding: 6px 8px; border: 1px solid #000; text-align: right; font-weight: bold; color: ${isZero ? '#b91c1c' : '#000'};">
          ${item.stock_qty} ${item.unit}
        </td>
        <td style="padding: 6px 8px; border: 1px solid #000; text-align: right;">
          ${item.reorder_level} ${item.unit}
        </td>
        <td style="padding: 6px 8px; border: 1px solid #000; text-align: right; font-family: monospace;">
          ${fmtInr(item.purchase_price)}
        </td>
      </tr>
    `;
  }).join('');

  document.body.classList.remove('printing-bill');
  document.body.classList.add('printing-restock');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-restock');
  }, 1000);
}

/* --- Keyboard Shortcuts (Enter to Unlock PIN / Add to Cart) --- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const pinModal = document.getElementById("pinModal");
    if (pinModal && pinModal.classList.contains("show")) {
      verifyPin();
    } else if (document.activeElement && (document.activeElement.id === "posQty" || document.activeElement.id === "posRate")) {
      addItemToCart();
    }
  }
});

// App Initialization with Security Gate
applyTheme(localStorage.getItem('bde_theme') || 'dark');
checkConsoleAuth();

/* --- Live Search & Select Filter for Customer & Product Dropdowns --- */
function filterPosCustomers() {
  const q = (document.getElementById('posCustSearch')?.value || '').trim().toLowerCase();
  const custSelect = document.getElementById('posCustomerSelect');
  if (!custSelect) return;

  const filtered = customersCache.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.phone.toLowerCase().includes(q) ||
    (c.address && c.address.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    custSelect.innerHTML = `<option value="">-- No matching customer found --</option>`;
    return;
  }

  custSelect.innerHTML = filtered.map(c => `
    <option value="${c.id}">${c.name} (${c.phone}) — [${c.category || 'Retailer'}]</option>
  `).join('');
}

function filterPosProducts() {
  const q = (document.getElementById('posProdSearch')?.value || '').trim().toLowerCase();
  const posProd = document.getElementById('posProductSelect');
  if (!posProd) return;

  const filtered = productsCache.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    (p.category && p.category.toLowerCase().includes(q)) ||
    (p.brand && p.brand.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    posProd.innerHTML = `<option value="">-- No matching product found --</option>`;
    return;
  }

  posProd.innerHTML = filtered.map(p =>
    `<option value="${p.id}">${p.name} (${p.sku}) — [Stock: ${p.stock_qty} ${p.unit}]</option>`
  ).join('');

  // Automatically load the rate & stock helper for the top matched item!
  onProductSelectChange();
}

function filterPurProducts() {
  const q = (document.getElementById('purProdSearch')?.value || '').trim().toLowerCase();
  const purProd = document.getElementById('purProductSelect');
  if (!purProd) return;

  const filtered = productsCache.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    (p.brand && p.brand.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    purProd.innerHTML = `<option value="">-- No matching product found --</option>`;
    return;
  }

  purProd.innerHTML = filtered.map(p =>
    `<option value="${p.id}">${p.name} (${p.sku}) — [Stock: ${p.stock_qty} ${p.unit}]</option>`
  ).join('');

  onPurProductChange();
}

/* --- Website Quote Inquiries Management (Search, Filter, Action & Dismiss) --- */
let websiteInquiriesCache = [];
let currentInquiryFilter = 'Pending'; // 'Pending' | 'Resolved' | 'All'
let currentInquirySearch = '';

async function loadWebsiteInquiries() {
  const tbody = document.getElementById('websiteInquiriesBody');
  if (!tbody) return;
  try {
    const res = await authFetch('/quote-inquiries?status=all');
    const data = await res.json();
    websiteInquiriesCache = Array.isArray(data) ? data : [];

    // Update Counts & Badges
    const pendingCount = websiteInquiriesCache.filter(q => (q.status || 'Pending').toLowerCase() === 'pending').length;
    const resolvedCount = websiteInquiriesCache.filter(q => (q.status || '').toLowerCase() === 'resolved').length;
    const allCount = websiteInquiriesCache.length;

    const navBadge = document.getElementById('inquiriesCountBadge');
    if (navBadge) {
      if (pendingCount > 0) {
        navBadge.textContent = pendingCount;
        navBadge.style.display = 'inline-block';
      } else {
        navBadge.style.display = 'none';
      }
    }

    const elP = document.getElementById('inqPendingCount');
    const elR = document.getElementById('inqResolvedCount');
    const elA = document.getElementById('inqAllCount');
    if (elP) elP.textContent = pendingCount;
    if (elR) elR.textContent = resolvedCount;
    if (elA) elA.textContent = allCount;

    renderWebsiteInquiries();
  } catch (err) {
    console.error('Failed to load inquiries:', err);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--rose);">Failed to load inquiries from server.</td></tr>`;
  }
}

function setInquiryStatusFilter(status) {
  currentInquiryFilter = status;
  ['inqFilterPending', 'inqFilterResolved', 'inqFilterAll'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.classList.remove('active');
  });
  const activeBtn = document.getElementById(`inqFilter${status}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderWebsiteInquiries();
}

function onInquirySearchChange() {
  const input = document.getElementById('inquirySearchInput');
  currentInquirySearch = input ? input.value.trim().toLowerCase() : '';
  renderWebsiteInquiries();
}

function renderWebsiteInquiries() {
  const tbody = document.getElementById('websiteInquiriesBody');
  if (!tbody) return;

  let filtered = websiteInquiriesCache.slice();

  // 1. Status Filter
  if (currentInquiryFilter === 'Pending') {
    filtered = filtered.filter(q => (q.status || 'Pending').toLowerCase() === 'pending');
  } else if (currentInquiryFilter === 'Resolved') {
    filtered = filtered.filter(q => (q.status || '').toLowerCase() === 'resolved');
  }

  // 2. Search Filter
  if (currentInquirySearch) {
    const term = currentInquirySearch;
    filtered = filtered.filter(q => {
      const qid = String(q.id || '');
      const name = (q.customer_name || '').toLowerCase();
      const phone = (q.phone || '').toLowerCase();
      const loc = (q.delivery_locality || '').toLowerCase();
      const items = (q.requested_items || '').toLowerCase();
      const type = (q.quote_type || '').toLowerCase();
      return qid.includes(term) || name.includes(term) || phone.includes(term) || 
             loc.includes(term) || items.includes(term) || type.includes(term);
    });
  }

  if (filtered.length === 0) {
    const emptyMsg = currentInquirySearch 
      ? `No inquiries matching "${currentInquirySearch}".`
      : (currentInquiryFilter === 'Pending' 
          ? `🎉 All clear! No pending customer enquiries right now.` 
          : `No ${currentInquiryFilter.toLowerCase()} enquiries found.`);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted); font-size:13px;">${emptyMsg}</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(q => {
    const cleanPhone = (q.phone || '').replace(/\D/g, '');
    const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    const isResolved = (q.status || '').toLowerCase() === 'resolved';

    // Type badge color
    let typeBadgeStyle = 'background: #312E81; color: #C7D2FE;';
    if ((q.quote_type || '').includes('3D')) typeBadgeStyle = 'background: #581C87; color: #E9D5FF;';
    if ((q.quote_type || '').includes('Carpenter')) typeBadgeStyle = 'background: #78350F; color: #FDE68A;';
    if ((q.quote_type || '').includes('Product')) typeBadgeStyle = 'background: #064E3B; color: #A7F3D0;';

    const replyMsg = encodeURIComponent(
      `Namaskar ${q.customer_name},\nThank you for reaching out to *Baba Dugdheswar Enterprise (Onda, Bankura)*.\n\nRegarding your enquiry for:\n${q.requested_items}\n\nWe have checked Onda Depot stock and here are the details:`
    );

    return `
      <tr id="inqRow-${q.id}" style="${isResolved ? 'opacity:0.85;' : ''}">
        <td class="mono"><strong>#Q-${q.id}</strong></td>
        <td style="font-size:11.5px; color:var(--text-muted);">${q.created_at}</td>
        <td style="font-weight:700;">
          ${q.customer_name}
          ${isResolved ? '<span style="display:inline-block; margin-left:4px; font-size:10px; background:#059669; color:#fff; padding:1px 6px; border-radius:4px;">Resolved</span>' : ''}
        </td>
        <td><span class="badge" style="${typeBadgeStyle} font-size:11px; padding:3px 8px; border-radius:6px;">${q.quote_type}</span></td>
        <td class="mono" style="font-size:12px;"><a href="tel:${q.phone}" style="color:var(--text-main); text-decoration:none;">📞 ${q.phone}</a></td>
        <td style="font-size:12px;">
          <div style="font-weight:700; color:var(--text-main); display:inline-flex; align-items:center; gap:4px;">
            <span>📍</span> <span>${q.delivery_locality || 'Onda, Bankura'}</span>
          </div>
        </td>
        <td style="white-space:pre-wrap; font-size:11.5px; max-width:320px; line-height:1.4;">${q.requested_items}</td>
        <td style="text-align:right;">
          <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
            <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="actionAndReplyInquiry(${q.id}, '${waPhone}', '${encodeURIComponent(q.customer_name)}', '${replyMsg}')" title="Reply on WhatsApp and automatically remove from active enquiries">
              💬 Reply &amp; Resolve
            </button>
            ${!isResolved ? `
              <button class="btn btn-secondary" style="padding:6px 9px; font-size:11px;" onclick="resolveInquiry(${q.id})" title="Mark enquiry as resolved (removes from active view)">
                ✅ Done
              </button>
            ` : `
              <button class="btn btn-secondary" style="padding:6px 9px; font-size:11px;" onclick="reopenInquiry(${q.id})" title="Move back to Pending">
                ↩️ Reopen
              </button>
            `}
            <button class="btn btn-danger" style="padding:6px 8px; font-size:11px;" onclick="deleteInquiry(${q.id})" title="Delete enquiry permanently">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function actionAndReplyInquiry(id, waPhone, encodedName, replyMsg) {
  const waUrl = `https://wa.me/${waPhone}?text=${replyMsg}`;
  window.open(waUrl, '_blank');
  
  // Mark resolved so it disappears from the active view immediately
  await resolveInquiry(id, true);
}

async function resolveInquiry(id, silent = false) {
  // Optimistic UI update
  const item = websiteInquiriesCache.find(q => q.id === id);
  if (item) {
    item.status = 'Resolved';
  }
  renderWebsiteInquiries();

  try {
    const res = await authFetch(`/quote-inquiries/${id}/resolve`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      if (!silent) showToast(`✅ Inquiry #Q-${id} resolved & removed from active list!`);
      // Update badge counts
      const pendingCount = websiteInquiriesCache.filter(q => (q.status || 'Pending').toLowerCase() === 'pending').length;
      const elP = document.getElementById('inqPendingCount');
      const elR = document.getElementById('inqResolvedCount');
      if (elP) elP.textContent = pendingCount;
      if (elR) elR.textContent = websiteInquiriesCache.length - pendingCount;
      const navBadge = document.getElementById('inquiriesCountBadge');
      if (navBadge) {
        if (pendingCount > 0) {
          navBadge.textContent = pendingCount;
          navBadge.style.display = 'inline-block';
        } else {
          navBadge.style.display = 'none';
        }
      }
    }
  } catch(e) {
    console.error('Error resolving inquiry:', e);
    showToast('Failed to resolve inquiry on server.', 'error');
    loadWebsiteInquiries();
  }
}

async function reopenInquiry(id) {
  const item = websiteInquiriesCache.find(q => q.id === id);
  if (item) item.status = 'Pending';
  renderWebsiteInquiries();

  try {
    const res = await authFetch(`/quote-inquiries/${id}/reopen`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(`Inquiry #Q-${id} moved back to Pending!`);
      loadWebsiteInquiries();
    }
  } catch(e) {
    console.error('Error reopening inquiry:', e);
    loadWebsiteInquiries();
  }
}

async function deleteInquiry(id) {
  if (!confirm(`Are you sure you want to permanently delete Inquiry #Q-${id}?`)) return;
  
  websiteInquiriesCache = websiteInquiriesCache.filter(q => q.id !== id);
  renderWebsiteInquiries();

  try {
    const res = await authFetch(`/quote-inquiries/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast(`Inquiry #Q-${id} deleted.`);
      loadWebsiteInquiries();
    }
  } catch(e) {
    console.error('Error deleting inquiry:', e);
    loadWebsiteInquiries();
  }
}

let adminTestimonialsCache = [];

async function loadAdminTestimonials() {
  const tbody = document.getElementById('adminTestimonialsBody');
  if (!tbody) return;
  try {
    const res = await authFetch('/testimonials/admin');
    const data = await res.json();
    adminTestimonialsCache = data || [];
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">No customer finished furniture photos uploaded yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(t => {
      const invBadge = (t.invoice_no && t.invoice_no !== '-') 
        ? `<span class="mono" style="color:var(--primary); font-weight:700; background:rgba(56,189,248,0.12); padding:3px 7px; border-radius:4px; font-size:12px;">${t.invoice_no}</span>`
        : `<span style="color:var(--text-muted); font-size:11px;">Direct Upload</span>`;

      const upiText = (t.cashback_upi && t.cashback_upi !== '-')
        ? `<div class="mono" style="color:var(--emerald); font-weight:700; font-size:11.5px;">${t.cashback_upi}</div>`
        : `<span style="color:var(--text-muted); font-size:11px;">None provided</span>`;

      let cbStatusBadge = `<span class="badge-cat badge-retailer" style="font-size:10.5px;">⏳ PENDING REVIEW</span>`;
      if (t.cashback_status === 'Paid' || t.cashback_status === 'paid') {
        cbStatusBadge = `<span class="badge-instock" style="background:#059669; color:#fff; font-size:10.5px;">✅ PAID (₹${t.cashback_amount || 0})</span>`;
      } else if (t.cashback_status === 'Approved' || t.cashback_status === 'approved') {
        cbStatusBadge = `<span class="badge-lowstock" style="background:#d97706; color:#fff; font-size:10.5px;">⏳ APPROVED (₹${t.cashback_amount || 0})</span>`;
      } else if (t.cashback_status === 'Rejected' || t.cashback_status === 'rejected') {
        cbStatusBadge = `<span class="badge-cat" style="background:#dc2626; color:#fff; font-size:10.5px;">❌ REJECTED</span>`;
      }

      let modStatusBadge = `<span class="badge-lowstock" style="background:#d97706; color:#fff; font-size:10.5px;">⏳ PENDING</span>`;
      if (t.status === 'approved' || t.is_approved) {
        modStatusBadge = `<span class="badge-instock" style="background:#059669; color:#fff; font-size:10.5px;">✅ LIVE</span>`;
      } else if (t.status === 'rejected') {
        modStatusBadge = `<span class="badge-cat" style="background:#dc2626; color:#fff; font-size:10.5px;">❌ REJECTED</span>`;
      }

      const roleBadge = t.author_role 
        ? `<span style="font-size:10px; color:var(--text-muted); background:var(--surface-sunken); padding:2px 5px; border-radius:4px; margin-left:4px;">${t.author_role}</span>` 
        : '';

      return `
        <tr>
          <td>
            <a href="${t.image_base64}" target="_blank" title="Click to view full photo">
              <img src="${t.image_base64}" style="width:85px; height:60px; object-fit:cover; border-radius:8px; border:1px solid var(--surface-border); display:block; cursor:zoom-in;" />
            </a>
          </td>
          <td>
            <strong>${t.project_title}</strong>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              ${t.created_at} &bull; Mistri: <strong>${t.carpenter_name}</strong>
            </div>
            ${t.materials_used ? `<div style="font-size:10.5px; color:var(--primary); margin-top:2px;">🪵 ${t.materials_used}</div>` : ''}
          </td>
          <td>
            <strong>${t.customer_name}</strong>${roleBadge}
            <div class="mono" style="font-size:11px; color:var(--text-muted);">${t.customer_phone}</div>
            <div style="font-size:11px; color:var(--text-muted);">${t.customer_location}</div>
          </td>
          <td>${invBadge}</td>
          <td>${upiText}</td>
          <td>${cbStatusBadge}</td>
          <td>${modStatusBadge}</td>
          <td style="text-align:right;">
            <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
              <button class="btn" style="padding:5px 10px; font-size:11px; background:#059669;" onclick="openCashbackModalById('${t.id}')">
                💸 Cashback
              </button>
              ${(t.is_approved || t.status === 'approved')
                ? `<button class="btn btn-secondary" style="padding:5px 9px; font-size:11px;" onclick="toggleTestimonialApprove('${t.id}')">Hide</button>`
                : `<button class="btn" style="padding:5px 9px; font-size:11px; background:#2563eb; color:#fff;" onclick="approveClaim('${t.id}')">✅ Publish</button>`
              }
              ${t.status !== 'rejected'
                ? `<button class="btn btn-secondary" style="padding:5px 8px; font-size:11px; background:rgba(220,38,38,0.12); color:#dc2626; border-color:rgba(220,38,38,0.3);" onclick="rejectClaim('${t.id}')">❌ Reject</button>`
                : ''
              }
              <button class="btn btn-danger" style="padding:5px 8px; font-size:11px;" onclick="deleteTestimonialAdmin('${t.id}')">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--rose);">Failed to load photos.</td></tr>`;
  }
}

function openCashbackModalById(id) {
  const t = adminTestimonialsCache.find(x => String(x.id) === String(id));
  if (!t) return;
  document.getElementById('cbItemId').value = t.id;
  document.getElementById('cbCustName').textContent = t.customer_name;
  document.getElementById('cbCustPhone').textContent = t.customer_phone;
  document.getElementById('cbInvoiceNo').textContent = t.invoice_no || 'None';
  document.getElementById('cbUpiId').textContent = t.cashback_upi || 'None';
  document.getElementById('cbAmount').value = t.cashback_amount > 0 ? t.cashback_amount : 200;
  document.getElementById('cbStatus').value = t.cashback_status === 'Paid' ? 'Paid' : (t.cashback_status === 'Approved' ? 'Approved' : 'Paid');

  const payBtn = document.getElementById('cbUpiPayBtn');
  const upi = t.cashback_upi;
  if (upi && upi !== '-' && upi.includes('@')) {
    payBtn.style.display = 'inline-flex';
    const amt = t.cashback_amount > 0 ? t.cashback_amount : 200;
    payBtn.href = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent('Baba Dugdheswar Enterprise')}&am=${encodeURIComponent(amt)}&cu=INR&tn=${encodeURIComponent('BDE Cashback Bill ' + (t.invoice_no || ''))}`;
  } else {
    payBtn.style.display = 'none';
  }

  document.getElementById('cashbackModal').classList.add('show');
}

function closeCashbackModal() {
  document.getElementById('cashbackModal').classList.remove('show');
}

async function saveCashbackPayout() {
  const id = document.getElementById('cbItemId').value;
  const amt = parseFloat(document.getElementById('cbAmount').value) || 0;
  const status = document.getElementById('cbStatus').value;

  try {
    const res = await authFetch(`/testimonials/${id}/cashback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashback_amount: amt, cashback_status: status })
    });
    const d = await res.json();
    showToast(d.message || "Cashback payout recorded!", "success");
    closeCashbackModal();
    loadAdminTestimonials();
  } catch (err) {
    showToast("Failed to save cashback update.", "error");
  }
}

async function approveClaim(id) {
  try {
    const res = await authFetch(`/testimonials/${id}/approve`, { method: 'POST' });
    const d = await res.json();
    showToast(d.message || "Photo approved and published live to Mistri Gram!", "success");
    loadAdminTestimonials();
  } catch (err) {
    showToast("Failed to approve photo.", "error");
  }
}

async function rejectClaim(id) {
  if (!confirm("Reject this photo submission? It will be hidden from Mistri Gram.")) return;
  try {
    const res = await authFetch(`/testimonials/${id}/reject`, { method: 'POST' });
    const d = await res.json();
    showToast(d.message || "Photo submission rejected.", "info");
    loadAdminTestimonials();
  } catch (err) {
    showToast("Failed to reject photo.", "error");
  }
}

async function toggleTestimonialApprove(id) {
  await authFetch(`/testimonials/${id}/approve`, { method: 'POST' });
  showToast("Photo visibility updated!", "success");
  loadAdminTestimonials();
}

async function deleteTestimonialAdmin(id) {
  if (!confirm("Delete this customer photo permanently?")) return;
  await authFetch(`/testimonials/${id}`, { method: 'DELETE' });
  showToast("Photo deleted.", "info");
  loadAdminTestimonials();
}

/* --- Showroom Staff AR Visualizer Helper --- */
function launchArVisualizer() {
  window.open('/#ar', '_blank');
}