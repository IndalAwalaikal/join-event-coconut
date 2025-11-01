// src/utils/auth.ts
const TOKEN_KEY = "admin_token";

// Simpan token ke localStorage
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Ambil token dari localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Hapus token (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Cek apakah sudah login
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
