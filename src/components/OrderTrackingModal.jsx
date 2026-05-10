import { useState, useRef, useEffect } from 'react';
import { DB } from '../js/db.js';

const STATUS_PROGRESS = ['baru', 'diproses', 'dikirim', 'selesai'];
const STATUS_LABELS = {
  baru: 'Baru', diproses: 'Diproses', dikirim: 'Dikirim',
  selesai: 'Selesai', dibatalkan: 'Dibatalkan'
};

export default function OrderTrackingModal({ open, onClose }) {
  const [inputId, setInputId] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) { inputRef.current.focus(); setOrder(null); setNotFound(false); setInputId(''); }
  }, [open]);

  function handleSearch(e) {
    e.preventDefault();
    const id = inputId.trim().toUpperCase();
    if (!id) return;
    const found = DB.getOrders().find(o => o.id.toUpperCase() === id);
    if (found) { setOrder(found); setNotFound(false); }
    else { setOrder(null); setNotFound(true); }
  }

  function getProgressIndex(status) {
    const idx = STATUS_PROGRESS.indexOf(status);
    return idx >= 0 ? idx : -1;
  }

  function rupiah(n) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
  }

  if (!open) return null;

  const isCancelled = order && order.status === 'dibatalkan';
  const progressIdx = order ? getProgressIndex(order.status) : -1;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Cek Pesanan</h2>

        <form onSubmit={handleSearch}>
          <div className="field">
            <label>Masukkan Nomor Order</label>
            <input type="text" ref={inputRef} value={inputId} onChange={(e) => setInputId(e.target.value.toUpperCase())} placeholder="Contoh: ORDABC123" style={{ textTransform: 'uppercase', letterSpacing: 1 }} />
          </div>
          <button type="submit" className="btn-modal btn-modal-yellow">Cari</button>
        </form>

        {notFound && (
          <div className="error-msg show" style={{ marginTop: 16 }}>Order tidak ditemukan. Periksa kembali nomor order anda.</div>
        )}

        {order && (
          <div style={{ marginTop: 24 }}>
            <div style={{ borderTop: '3px solid #000', paddingTop: 20 }} />

            {/* STATUS PROGRESS */}
            <div className={`tracking-progress${isCancelled ? ' cancelled' : ''}`}>
              {STATUS_PROGRESS.map((s, i) => {
                let cls = 'tracking-step';
                if (isCancelled) cls += ' cancelled';
                else if (i < progressIdx) cls += ' done';
                else if (i === progressIdx) cls += ' active';
                else cls += ' pending';
                return (
                  <div key={s} className={cls}>
                    <div className="tracking-dot" />
                    <div className="tracking-label">{STATUS_LABELS[s]}</div>
                    {i < STATUS_PROGRESS.length - 1 && <div className={`tracking-line${isCancelled ? ' cancelled' : i < progressIdx ? ' done' : ''}`} />}
                  </div>
                );
              })}
            </div>

            {isCancelled && (
              <div style={{ textAlign: 'center', margin: '16px 0', padding: 8, border: '3px solid #FF0000', background: '#FFE0E0', fontWeight: 700, fontSize: 14 }}>
                Pesanan ini telah dibatalkan.
              </div>
            )}

            {/* ORDER DETAILS */}
            <div style={{ marginTop: 20 }}>
              <div className="tracking-detail-row">
                <span className="tracking-detail-label">Order ID</span>
                <span className="tracking-detail-value">{order.id}</span>
              </div>
              <div className="tracking-detail-row">
                <span className="tracking-detail-label">Pelanggan</span>
                <span className="tracking-detail-value">{order.customer}</span>
              </div>
              <div className="tracking-detail-row">
                <span className="tracking-detail-label">Tanggal</span>
                <span className="tracking-detail-value">{order.tanggal}</span>
              </div>
              <div className="tracking-detail-row">
                <span className="tracking-detail-label">Status</span>
                <span className="tracking-detail-value" style={{ fontWeight: 800, color: isCancelled ? '#FF0000' : '#000' }}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 16, borderTop: '2px solid #eee', paddingTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Items Pesanan</div>
              {order.items.map((item, i) => (
                <div key={i} className="tracking-detail-row" style={{ fontSize: 14 }}>
                  <span>{item.nama} x{item.qty}</span>
                  <span style={{ fontWeight: 700 }}>{rupiah(item.harga * item.qty)}</span>
                </div>
              ))}
              <div className="tracking-detail-row" style={{ borderTop: '2px solid #000', marginTop: 8, paddingTop: 8, fontWeight: 800, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: '#FF006E' }}>{rupiah(order.total)}</span>
              </div>
            </div>

            {order.catatan && (
              <div style={{ marginTop: 12, padding: 8, border: '2px solid #000', background: '#f9f9f9', fontSize: 13 }}>
                <strong>Catatan:</strong> {order.catatan}
              </div>
            )}
          </div>
        )}

        <button className="btn-modal btn-modal-yellow" style={{ marginTop: 20 }} onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}
