import { hashPassword } from './crypto.js';

const prefix = 'tuistore_';

function _get(key) {
  try { return JSON.parse(localStorage.getItem(prefix + key)); }
  catch { return null; }
}

function _set(key, val) {
  localStorage.setItem(prefix + key, JSON.stringify(val));
}

function _id() {
  return 'TUI' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function _today() {
  return new Date().toISOString().split('T')[0];
}

async function seed() {
  if (_get('_seeded')) return;

  const hashed = await hashPassword('admin123');
  _set('admin', { password: hashed });

  const products = [
    { id: _id(), nama: 'TUI Signature Tee', harga: 85000, stok: 50, kategori: 'Kaos', deskripsi: 'Kaos signature dengan logo TUI-Store embossed. Cotton combed 30s.' },
    { id: _id(), nama: 'TUI Vintage Tee', harga: 95000, stok: 35, kategori: 'Kaos', deskripsi: 'Kaos vintage wash dengan artwork retro TUI.' },
    { id: _id(), nama: 'TUI Striped Shirt', harga: 120000, stok: 25, kategori: 'Kemeja', deskripsi: 'Kemeja casual dengan stripe pattern modern.' },
    { id: _id(), nama: 'TUI Flannel Shirt', harga: 150000, stok: 20, kategori: 'Kemeja', deskripsi: 'Flannel shirt premium bahan soft, nyaman dipakai sehari-hari.' },
    { id: _id(), nama: 'TUI Bomber Jacket', harga: 250000, stok: 15, kategori: 'Jaket', deskripsi: 'Bomber jacket dengan bordir TUI di bagian dada.' },
    { id: _id(), nama: 'TUI Hoodie', harga: 180000, stok: 30, kategori: 'Jaket', deskripsi: 'Hoodie fleece tebal cocok untuk santai.' },
    { id: _id(), nama: 'TUI Denim Jacket', harga: 300000, stok: 10, kategori: 'Jaket', deskripsi: 'Denim jacket limited edition, patch TUI di lengan.' },
    { id: _id(), nama: 'TUI Cargo Pants', harga: 135000, stok: 28, kategori: 'Celana', deskripsi: 'Cargo pants dengan 6 kantong, bahan durable.' },
    { id: _id(), nama: 'TUI Chino Pants', harga: 140000, stok: 22, kategori: 'Celana', deskripsi: 'Chino pants slim fit, cocok untuk semi formal.' },
    { id: _id(), nama: 'TUI Short Pants', harga: 85000, stok: 40, kategori: 'Celana', deskripsi: 'Shorts casual dengan tali serut, bahan adem.' },
  ];
  _set('products', products);

  const sampleOrders = [
    { id: 'ORDS1', customer: 'Ahmad Fauzi', items: [{ nama: 'TUI Signature Tee', harga: 85000, qty: 2 }], total: 170000, status: 'selesai', tanggal: '2026-05-01', catatan: '' },
    { id: 'ORDS2', customer: 'Siti Nurhaliza', items: [{ nama: 'TUI Hoodie', harga: 180000, qty: 1 }, { nama: 'TUI Short Pants', harga: 85000, qty: 1 }], total: 265000, status: 'dikirim', tanggal: '2026-05-05', catatan: '' },
    { id: 'ORDS3', customer: 'Budi Santoso', items: [{ nama: 'TUI Bomber Jacket', harga: 250000, qty: 1 }], total: 250000, status: 'diproses', tanggal: '2026-05-08', catatan: '' },
  ];
  _set('orders', sampleOrders);

  _set('transactions', []);
  _set('saldo', 0);
  _set('_seeded', true);
}

export const DB = {
  seed,

  getProducts() { return _get('products') || []; },
  getProduct(id) { return this.getProducts().find(p => p.id === id); },

  addProduct(data) {
    const products = this.getProducts();
    const p = { id: _id(), ...data };
    products.push(p);
    _set('products', products);
    return p;
  },

  updateProduct(id, data) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data };
    _set('products', products);
    return products[idx];
  },

  deleteProduct(id) {
    _set('products', this.getProducts().filter(p => p.id !== id));
  },

  updateStock(id, qtyChange) {
    const p = this.getProduct(id);
    if (!p) return false;
    const newStok = p.stok + qtyChange;
    if (newStok < 0) return false;
    this.updateProduct(id, { stok: newStok });
    return true;
  },

  getOrders() { return _get('orders') || []; },
  getOrder(id) { return this.getOrders().find(o => o.id === id); },

  addOrder(data) {
    const orders = this.getOrders();
    const o = { id: 'ORD' + Date.now().toString(36).toUpperCase(), ...data, tanggal: _today() };
    orders.unshift(o);
    _set('orders', orders);
    return o;
  },

  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    orders[idx].status = status;
    _set('orders', orders);
    return orders[idx];
  },

  updateOrderTransaction(id, transactionId) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    orders[idx].transactionId = transactionId || undefined;
    _set('orders', orders);
    return orders[idx];
  },

  deleteOrder(id) {
    _set('orders', this.getOrders().filter(o => o.id !== id));
  },

  getTransactions() { return _get('transactions') || []; },
  getSaldo() { return _get('saldo') || 0; },

  addTransaction(data) {
    const transactions = this.getTransactions();
    const t = { id: _id(), ...data, tanggal: _today() };
    transactions.unshift(t);
    _set('transactions', transactions);
    const saldo = this.getSaldo();
    _set('saldo', saldo + (data.tipe === 'pemasukan' ? data.jumlah : -data.jumlah));
    return t;
  },

  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const t = transactions.find(x => x.id === id);
    if (t) {
      const saldo = this.getSaldo();
      _set('saldo', saldo + (t.tipe === 'pemasukan' ? -t.jumlah : t.jumlah));
    }
    _set('transactions', transactions.filter(x => x.id !== id));
  },

  getStats() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const transactions = this.getTransactions();
    const saldo = this.getSaldo();

    const totalRevenue = orders.filter(o => o.status !== 'dibatalkan').reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const totalIncome = transactions.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.jumlah, 0);
    const totalExpense = transactions.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.jumlah, 0);
    const totalProfit = totalIncome - totalExpense;
    const productSold = orders.filter(o => o.status !== 'dibatalkan').reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);

    return { totalRevenue, totalOrders, totalIncome, totalExpense, totalProfit, productSold, productCount: products.length, saldo };
  },

  getMonthlyReport(months = 6) {
    const orders = this.getOrders();
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
      const monthOrders = orders.filter(o => {
        const d = new Date(o.tanggal);
        return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth();
      });
      return {
        label: m.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.filter(o => o.status !== 'dibatalkan').reduce((s, o) => s + o.total, 0),
        count: monthOrders.length
      };
    });
  },

  getTransactionReport(filter) {
    const transactions = this.getTransactions();
    const now = new Date();
    let filtered;

    switch (filter) {
      case 'hari': {
        const today = now.toISOString().split('T')[0];
        filtered = transactions.filter(t => t.tanggal === today);
        break;
      }
      case 'minggu': {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        filtered = transactions.filter(t => new Date(t.tanggal) >= weekAgo);
        break;
      }
      case 'bulan': {
        const month = now.getMonth();
        const year = now.getFullYear();
        filtered = transactions.filter(t => {
          const d = new Date(t.tanggal);
          return d.getMonth() === month && d.getFullYear() === year;
        });
        break;
      }
      case 'tahun': {
        const year = now.getFullYear();
        filtered = transactions.filter(t => new Date(t.tanggal).getFullYear() === year);
        break;
      }
      default: filtered = transactions;
    }

    const income = filtered.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.jumlah, 0);
    const expense = filtered.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.jumlah, 0);
    return { transactions: filtered, income, expense, profit: income - expense, count: filtered.length };
  },

  rupiah(n) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
  },

  reset() {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix)) localStorage.removeItem(key);
    }
  }
};

DB.seed();
