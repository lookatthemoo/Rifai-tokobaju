import { useState, useEffect } from 'react';
import { DB } from '../js/db.js';

export default function FinanceManager() {
  const [transactions, setTransactions] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [tipe, setTipe] = useState('pemasukan');
  const [jumlah, setJumlah] = useState('');
  const [kategori, setKategori] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const refresh = () => { setTransactions(DB.getTransactions()); setSaldo(DB.getSaldo()); };
  useEffect(refresh, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!jumlah || !kategori.trim()) return;
    DB.addTransaction({ tipe, jumlah: parseInt(jumlah), kategori: kategori.trim(), keterangan: keterangan.trim() });
    setJumlah(''); setKategori(''); setKeterangan('');
    refresh();
  }

  function handleDelete(id) {
    if (confirm('Hapus transaksi ini?')) { DB.deleteTransaction(id); refresh(); }
  }

  const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stat-card color-yellow" style={{ textAlign: 'center' }}>
          <div className="stat-label">Saldo Saat Ini</div>
          <div className="stat-value">{rupiah(saldo)}</div>
        </div>
      </div>

      <div className="form-card">
        <h3>Catat Transaksi Baru</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipe</label>
              <select value={tipe} onChange={(e) => setTipe(e.target.value)}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div className="form-group">
              <label>Jumlah (Rp)</label>
              <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" min="0" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Kategori</label>
              <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder={tipe === 'pemasukan' ? 'Contoh: Penjualan, Investasi' : 'Contoh: Modal, Operasional'} required />
            </div>
            <div className="form-group">
              <label>Keterangan</label>
              <input type="text" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Deskripsi transaksi" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-yellow">Catat Transaksi</button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tanggal</th><th>Tipe</th><th>Kategori</th><th>Jumlah</th><th>Keterangan</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p>Belum ada transaksi</p></div></td></tr>
            ) : transactions.map(t => (
              <tr key={t.id}>
                <td>{t.tanggal}</td>
                <td style={{ fontWeight: 700, color: t.tipe === 'pemasukan' ? '#00AA00' : '#FF0000' }}>
                  {t.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                </td>
                <td>{t.kategori}</td>
                <td style={{ fontWeight: 700 }}>{rupiah(t.jumlah)}</td>
                <td>{t.keterangan || '-'}</td>
                <td><button className="btn btn-red btn-small" onClick={() => handleDelete(t.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
