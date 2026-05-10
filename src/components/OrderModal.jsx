import { useState } from 'react';
import { DB } from '../js/db.js';

export default function OrderModal({ product, onClose }) {
  const [nama, setNama] = useState('');
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState('form');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const total = product ? product.harga * qty : 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim()) { setError('Nama pembeli harus diisi.'); return; }
    if (qty < 1 || qty > product.stok) { setError('Jumlah tidak valid.'); return; }

    const items = [{ nama: product.nama, harga: product.harga, qty }];
    const order = DB.addOrder({
      customer: nama.trim(),
      items,
      total,
      status: 'baru',
      catatan: ''
    });

    DB.updateStock(product.id, -qty);
    setOrderId(order.id);
    setStep('success');
  }

  if (!product) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>X</button>

        {step === 'form' && (
          <>
            <h2>Pesan {product.nama}</h2>
            <div className="field">
              <label>Produk</label>
              <input type="text" value={`${product.nama} - Rp ${new Intl.NumberFormat('id-ID').format(product.harga)}`} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="field">
              <label>Nama Pembeli</label>
              <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama anda" />
            </div>
            <div className="field">
              <label>Jumlah (max {product.stok})</label>
              <input type="number" value={qty} min={1} max={product.stok} onChange={(e) => setQty(Math.min(Math.max(parseInt(e.target.value) || 1, 1), product.stok))} />
            </div>
            <div className="order-total">Total: Rp {new Intl.NumberFormat('id-ID').format(total)}</div>
            {error && <div className="error-msg show">{error}</div>}
            <button className="btn-modal btn-modal-blue" onClick={handleSubmit}>Pesan Sekarang</button>
          </>
        )}

        {step === 'success' && (
          <div className="success-msg">
            <h2>Pesanan Berhasil!</h2>
            <p style={{ marginTop: 12, fontSize: 14 }}>Nomor Order anda:</p>
            <div className="order-id">{orderId}</div>
            <p style={{ marginTop: 12, fontSize: 14, color: '#555' }}>
              Silakan tunjukkan nomor order ini ke admin TUI-Store.
            </p>
            <button className="btn-modal btn-modal-yellow" style={{ marginTop: 24 }} onClick={onClose}>Tutup</button>
          </div>
        )}
      </div>
    </div>
  );
}
