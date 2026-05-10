import { useState, useRef, useEffect } from 'react';

export default function AdminLoginModal({ open, onClose, onLogin, onLoginSuccess }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (await onLogin(pass)) {
      onLoginSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-box${shake ? ' shake' : ''}`}>
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Admin Access</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Password</label>
            <input type="password" ref={inputRef} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Masukkan password" autoComplete="off" />
          </div>
          <button type="submit" className="btn-modal btn-modal-yellow">Masuk</button>
          <div className={`error-msg${error ? ' show' : ''}`}>Password salah. Coba lagi.</div>
        </form>
      </div>
    </div>
  );
}
