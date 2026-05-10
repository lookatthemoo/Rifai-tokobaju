import { useState, useEffect } from 'react';
import { DB } from '../js/db.js';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [formItems, setFormItems] = useState([{ nama: '', harga: '', qty: 1 }]);
  const [customer, setCustomer] = useState('');
  const [catatan, setCatatan] = useState('');

  const refresh = () => setOrders(DB.getOrders());
  useEffect(refresh, []);

  function handleStatusChange(id, status) {
    DB.updateOrderStatus(id, status);
    refresh();
  }

  function handleDelete(id) {
    if (confirm('Hapus order ini?')) { DB.deleteOrder(id); refresh(); }
  }

  function addItem() {
    setFormItems([...formItems, { nama: '', harga: '', qty: 1 }]);
  }

  function updateItem(idx, field, val) {
    const items = [...formItems];
    items[idx][field] = val;
    setFormItems(items);
  }

  function removeItem(idx) {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const items = formItems
      .filter(i => i.nama.trim() && i.harga)
      .map(i => ({ nama: i.nama.trim(), harga: parseInt(i.harga), qty: parseInt(i.qty) || 1 }));
    if (items.length === 0) return;

    const total = items.reduce((s, i) => s + i.harga * i.qty, 0);
    DB.addOrder({ customer: customer.trim() || 'Walk-in Customer', items, total, status: 'baru', catatan: catatan.trim() });
    setFormItems([{ nama: '', harga: '', qty: 1 }]);
    setCustomer('');
    setCatatan('');
    refresh();
  }

  const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

  return (
    <div>
      <div className="form-card">
        <h3>Tambah Order Baru</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Pelanggan</label>
              <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nama pelanggan" />
            </div>
            <div className="form-group">
              <label>Catatan</label>
              <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Catatan (opsional)" />
            </div>
          </div>
          <div className="form-group">
            <label>Item Pesanan</label>
            {formItems.map((item, i) => (
              <div key={i} className="order-item-mobile" style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <input type="text" value={item.nama} onChange={(e) => updateItem(i, 'nama', e.target.value)} placeholder="Nama produk" />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <input type="number" value={item.harga} onChange={(e) => updateItem(i, 'harga', e.target.value)} placeholder="Harga" />
                </div>
                <div className="form-group" style={{ flex: '0 0 70px', marginBottom: 0 }}>
                  <input type="number" value={item.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} min="1" />
                </div>
                {formItems.length > 1 && (
                  <button type="button" className="btn btn-red btn-small" style={{ marginBottom: 0 }} onClick={() => removeItem(i)}>X</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-blue btn-small" onClick={addItem} style={{ marginTop: 4 }}>Tambah Item</button>
          </div>
          <div className="form-actions" style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-yellow">Buat Order</button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>No. Order</th><th>Pelanggan</th><th>Items</th><th>Total</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><p>Belum ada order</p></div></td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td style={{ fontSize: 12 }}>{o.items.map(i => `${i.nama} x${i.qty}`).join(', ')}</td>
                <td>{rupiah(o.total)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, padding: '4px 8px', border: '3px solid #000', background: '#fff' }}
                  >
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="dikirim">Dikirim</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </td>
                <td>{o.tanggal}</td>
                <td><button className="btn btn-red btn-small" onClick={() => handleDelete(o.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
