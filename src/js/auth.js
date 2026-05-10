import { hashPassword } from './crypto.js';

export const Auth = {
  async login(password) {
    const admin = JSON.parse(localStorage.getItem('tuistore_admin'));
    if (admin && admin.password === await hashPassword(password)) {
      sessionStorage.setItem('tuistore_session', 'logged_in');
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('tuistore_session');
  },

  isLoggedIn() {
    return sessionStorage.getItem('tuistore_session') === 'logged_in';
  }
};
