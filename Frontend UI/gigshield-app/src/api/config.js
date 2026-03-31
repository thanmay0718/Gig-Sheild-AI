// ═══════════════════════════════════════════════════
// GIGSHIELD API CONFIGURATION
// Base URL & helper for all backend API calls
// ═══════════════════════════════════════════════════

const API_BASE = 'http://localhost:8080/api/v1';

/**
 * Centralized fetch wrapper with JWT auth
 * Automatically attaches Bearer token from localStorage
 */
export async function apiFetch(endpoint, options = {}) {
  // Since the backend uses secure HttpOnly cookies, we don't need a token here.
  // We just let the browser handle the cookies automatically.
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const isAuth = options.isAuthTarget;
  if ('isAuthTarget' in options) delete options.isAuthTarget;
  const baseUrl = isAuth ? 'http://localhost:8080' : API_BASE;

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include' // ✅ CRITICAL: This tells fetch to include the cookies!
    });

    // If 401 unauthorized (and we are not trying to login), clear token and redirect to login
    if (res.status === 401) {
      localStorage.removeItem('gs_user');

      // ✅ REMOVED the window.location reload here.
      // This stops the "automatic logout" logic so we can debug.
      if (endpoint.includes('/auth/login')) {
        throw new Error('Invalid email or password');
      }
      // Instead of reloading, we throw an error for the component to handle
      throw new Error('Unauthorized: Session expired or invalid');
    }

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = res.statusText;
      try {
        const errObj = JSON.parse(errorText);
        errorMessage = errObj.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage || `API Error: ${res.status}`);
    }

    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return text;
    }
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err.message);
    throw err;
  }
}

// ═══════════════════════════════════════════════════
// AUTH ENDPOINTS
// POST http://localhost:8080/auth/register → Register new user
// POST http://localhost:8080/auth/login    → Login & get JWT token
// ═══════════════════════════════════════════════════
// Notice: The Java backend maps auth to `/auth` directly, not `/api/v1/auth`
export const authAPI = {
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data), isAuthTarget: true }),
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data), isAuthTarget: true }),
  profile: () => apiFetch('/auth/profile', { isAuthTarget: true }),
  logout: () => apiFetch('/auth/logout', { method: 'POST', isAuthTarget: true }),
};

// ═══════════════════════════════════════════════════
// WORKER ENDPOINTS
// POST   /api/v1/workers       → Create worker profile
// GET    /api/v1/workers       → Get all workers
// GET    /api/v1/workers/{id}  → Get worker by ID
// PUT    /api/v1/workers/{id}  → Update worker
// DELETE /api/v1/workers/{id}  → Delete worker
// ═══════════════════════════════════════════════════
export const workersAPI = {
  create: (data) => apiFetch('/workers', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiFetch('/workers'),
  getById: (id) => apiFetch(`/workers/${id}`),
  update: (id, data) => apiFetch(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/workers/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════════════
// POLICY ENDPOINTS
// POST   /api/v1/policies                    → Create policy
// GET    /api/v1/policies                    → Get all policies
// GET    /api/v1/policies/{id}               → Get policy by ID
// GET    /api/v1/policies?workerId={wId}     → Get policies by worker
// PUT    /api/v1/policies/{id}               → Update policy
// DELETE /api/v1/policies/{id}               → Delete policy
// ═══════════════════════════════════════════════════
export const policiesAPI = {
  create: (data) => apiFetch('/policies', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiFetch('/policies'),
  getById: (id) => apiFetch(`/policies/${id}`),
  getByWorker: (wId) => apiFetch(`/policies?workerId=${wId}`),
  update: (id, data) => apiFetch(`/policies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/policies/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════════════
// CLAIMS ENDPOINTS
// POST   /api/v1/claims                        → Create claim
// GET    /api/v1/claims                        → Get all claims
// GET    /api/v1/claims/{id}                   → Get claim by ID
// GET    /api/v1/claims/worker/{workerId}      → Get claims by worker
// GET    /api/v1/claims/status/{status}        → Get claims by status
// PUT    /api/v1/claims/{id}                   → Update claim
// DELETE /api/v1/claims/{id}                   → Delete claim
// ═══════════════════════════════════════════════════
export const claimsAPI = {
  create: (data) => apiFetch('/claims', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiFetch('/claims'),
  getById: (id) => apiFetch(`/claims/${id}`),
  getByWorker: (wId) => apiFetch(`/claims/worker/${wId}`),
  getByStatus: (s) => apiFetch(`/claims/status/${s}`),
  update: (id, data) => apiFetch(`/claims/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/claims/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════════════════
// PAYMENT ENDPOINTS
// POST  /api/v1/payments                         → Create payment
// GET   /api/v1/payments                         → Get all payments
// GET   /api/v1/payments/{id}                    → Get payment by ID
// GET   /api/v1/payments/worker/{workerId}       → Get payments by worker
// GET   /api/v1/payments/policy/{policyId}       → Get payments by policy
// GET   /api/v1/payments/status/{status}         → Get payments by status
// PATCH /api/v1/payments/{id}/status?status=X    → Update payment status
// ═══════════════════════════════════════════════════
export const paymentsAPI = {
  create: (data) => apiFetch('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiFetch('/payments'),
  getById: (id) => apiFetch(`/payments/${id}`),
  getByWorker: (wId) => apiFetch(`/payments/worker/${wId}`),
  getByPolicy: (pId) => apiFetch(`/payments/policy/${pId}`),
  getByStatus: (s) => apiFetch(`/payments/status/${s}`),
  updateStatus: (id, status) => apiFetch(`/payments/${id}/status?status=${status}`, { method: 'PATCH' }),
};

// ═══════════════════════════════════════════════════
// FRAUD DETECTION ENDPOINTS
// POST /api/v1/fraud/check                → Check claim for fraud
// GET  /api/v1/fraud/{claimId}            → Get fraud result by claim
// GET  /api/v1/fraud/worker/{workerId}    → Get fraud history by worker
// ═══════════════════════════════════════════════════
export const fraudAPI = {
  check: (data) => apiFetch('/fraud/check', { method: 'POST', body: JSON.stringify(data) }),
  getByClaimId: (cId) => apiFetch(`/fraud/${cId}`),
  getByWorker: (wId) => apiFetch(`/fraud/worker/${wId}`),
};
