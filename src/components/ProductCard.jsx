const bgColors = ['#FF006E', '#3A86FF', '#FF6B00', '#9B30FF', '#00FF00', '#FFD700'];

export default function ProductCard({ product, index, onOrder }) {
  const bg = bgColors[index % bgColors.length];

  return (
    <div
      className="product-card"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        e.currentTarget.style.transform = `perspective(800px) rotateX(${(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * -12}deg) translate(-3px, -3px)`;
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
    >
      <div className="product-card-image" style={{ background: bg }}>
        <div className="product-label">{product.nama}</div>
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.kategori}</span>
        <h3>{product.nama}</h3>
        <div className="product-price">Rp {new Intl.NumberFormat('id-ID').format(product.harga)}</div>
        <div className="product-stock">Stok: <strong>{product.stok}</strong> pcs</div>
        {product.deskripsi && <div className="product-desc">{product.deskripsi}</div>}
      </div>
      <div className="product-card-footer">
        <button className="btn-pesan" onClick={() => onOrder(product)}>Pesan</button>
      </div>
    </div>
  );
}
