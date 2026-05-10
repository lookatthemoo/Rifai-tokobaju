import { useState, useEffect } from 'react';
import { DB } from '../js/db.js';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nama: '', harga: '', stok: '', kategori: 'Kaos', deskripsi: '' });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const refresh = () => setProducts(DB.getProducts());
  useEffect(refresh, []);

  function resetForm() {
    setEditId(null);
    setForm({ nama: '', harga: '', stok: '', kategori: 'Kaos', deskripsi: '' });
  }

  function handleEdit(p) {
    setEditId(p.id);
    setForm({ nama: p.nama, harga: p.harga, stok: p.stok, kategori: p.kategori, deskripsi: p.deskripsi || '' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { nama: form.nama.trim(), harga: parseInt(form.harga), stok: parseInt(form.stok), kategori: form.kategori, deskripsi: form.deskripsi.trim() };
    if (!data.nama || !data.harga) return;
    if (editId) DB.updateProduct(editId, data);
    else DB.addProduct(data);
    resetForm();
    refresh();
  }

  function handleDelete(id) {
    if (confirm('Hapus produk ini?')) { DB.deleteProduct(id); refresh(); }
  }

  let filtered = products;
  if (filterCat) filtered = filtered.filter(p => p.kategori === filterCat);
  if (search) filtered = filtered.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()) || p.kategori.toLowerCase().includes(search.toLowerCase()));

  const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

  return (
    <div>
      <div className="form-card">
        <h3>{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Produk</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama produk" required />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                <option value="Kaos">Kaos</option><option value="Kemeja">Kemeja</option>
                <option value="Jaket">Jaket</option><option value="Celana">Celana</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input type="number" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} placeholder="0" min="0" required />
            </div>
            <div className="form-group">
              <label>Stok</label>
              <input type="number" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} placeholder="0" min="0" required />
            </div>
          </div>
          <div className="form-group">
            <label>Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi produk" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-yellow">{editId ? 'Update Produk' : 'Simpan Produk'}</button>
            {editId && <button type="button" className="btn btn-pink" onClick={resetForm}>Batal</button>}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: 150, marginBottom: 0 }}>
          <label>Cari Produk</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau kategori..." />
        </div>
        <div className="form-group" style={{ flex: '0 0 120px', marginBottom: 0 }}>
          <label>Filter</label>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">Semua</option>
            <option value="Kaos">Kaos</option><option value="Kemeja">Kemeja</option>
            <option value="Jaket">Jaket</option><option value="Celana">Celana</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>No</th><th>Nama Produk</th><th>Harga</th><th>Stok</th><th>Kategori</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p>Tidak ada produk ditemukan</p></div></td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.nama}</td>
                <td>{rupiah(p.harga)}</td>
                <td>{p.stok}</td>
                <td><strong>{p.kategori}</strong></td>
                <td><div className="btn-group">
                  <button className="btn btn-blue btn-small" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-red btn-small" onClick={() => handleDelete(p.id)}>Hapus</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
