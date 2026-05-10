export default function Sidebar({ pages, activePage, onPageChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">TUI-Store</div>
      <nav className="sidebar-nav">
        {pages.map(p => (
          <button key={p.key} className={activePage === p.key ? 'active' : ''} onClick={() => onPageChange(p.key)}>
            {p.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>Keluar</button>
      </div>
    </aside>
  );
}
