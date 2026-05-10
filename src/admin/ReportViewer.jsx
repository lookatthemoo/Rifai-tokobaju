import { useState, useEffect } from 'react';
import { DB } from '../js/db.js';

export default function ReportViewer() {
  const [filter, setFilter] = useState('bulan');
  const [report, setReport] = useState(DB.getTransactionReport('bulan'));

  useEffect(() => { setReport(DB.getTransactionReport(filter)); }, [filter]);

  const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

  return (
    <div>
      <div className="report-filters">
        <div className="form-group">
          <label>Periode</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="hari">Hari Ini</option>
            <option value="minggu">7 Hari Terakhir</option>
            <option value="bulan">Bulan Ini</option>
            <option value="tahun">Tahun Ini</option>
            <option value="semua">Semua Waktu</option>
          </select>
        </div>
      </div>

      <div className="report-summary">
        <div className="report-card color-green">
          <div className="report-label">Total Pemasukan</div>
          <div className="report-value">{rupiah(report.income)}</div>
        </div>
        <div className="report-card color-pink">
          <div className="report-label">Total Pengeluaran</div>
          <div className="report-value">{rupiah(report.expense)}</div>
        </div>
        <div className="report-card color-yellow">
          <div className="report-label">Laba Bersih</div>
          <div className="report-value">{rupiah(report.profit)}</div>
        </div>
        <div className="report-card color-blue">
          <div className="report-label">Jumlah Transaksi</div>
          <div className="report-value">{report.count}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tanggal</th><th>Tipe</th><th>Kategori</th><th>Jumlah</th><th>Keterangan</th></tr>
          </thead>
          <tbody>
            {report.transactions.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><p>Tidak ada transaksi di periode ini</p></div></td></tr>
            ) : report.transactions.map(t => (
              <tr key={t.id}>
                <td>{t.tanggal}</td>
                <td style={{ fontWeight: 700, color: t.tipe === 'pemasukan' ? '#00AA00' : '#FF0000' }}>
                  {t.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                </td>
                <td>{t.kategori}</td>
                <td style={{ fontWeight: 700 }}>{rupiah(t.jumlah)}</td>
                <td>{t.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
