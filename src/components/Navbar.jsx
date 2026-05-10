import { useRef } from 'react';

export default function Navbar({ onLogoClick, onNavClick, onTrackingClick }) {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={onLogoClick}>TUI-Store</div>
      <ul className="nav-links">
        <li><a href="#koleksi" onClick={(e) => { e.preventDefault(); onNavClick('koleksi'); }}>Koleksi</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); onTrackingClick(); }}>Cek Pesanan</a></li>
        <li><a href="#tentang" onClick={(e) => { e.preventDefault(); onNavClick('tentang'); }}>Tentang</a></li>
        <li><a href="#kontak" onClick={(e) => { e.preventDefault(); onNavClick('kontak'); }}>Kontak</a></li>
      </ul>
    </nav>
  );
}
