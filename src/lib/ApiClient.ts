// lib/ApiClient.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in environment variables.");
}

// lib/ApiClient.ts

// Tambahkan fungsi helper
function buildUrl(endpoint: string, params?: Record<string, string>) {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${base}/${cleanEndpoint}`;
  
  if (!params) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  return `${url}?${searchParams.toString()}`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<T> {
  const url = buildUrl(endpoint, params);

  const token = endpoint.startsWith('/admin') && endpoint !== '/admin/login'
    ? localStorage.getItem('adminToken')
    : null;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP Error ${response.status}: ${response.statusText}` +
      (errorData?.message ? ` - ${errorData.message}` : '')
    );
  }

  return response.json() as Promise<T>;
}

export const ApiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }, params),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
};