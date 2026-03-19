import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function errorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function loginUser(payload) {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to log in"));
  }
}

export async function registerUser(payload) {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to register"));
  }
}

// ── Workers ───────────────────────────────────────────────────────────────────
// FIXED: was /workers — conflicts with WorkerController
// AdminController now maps this to /admin/workers
export async function getWorkers() {
  try {
    const { data } = await api.get("/admin/workers");
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load workers"));
  }
}

export async function createWorker(payload) {
  try {
    const { data } = await api.post("/workers", payload);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to create worker"));
  }
}

// ── Policies ──────────────────────────────────────────────────────────────────
export async function getPolicies(workerId) {
  try {
    const url = workerId ? `/policies/worker/${workerId}` : "/policies";
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load policies"));
  }
}

export async function createPolicy(payload) {
  try {
    const { data } = await api.post("/policies", payload);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to create policy"));
  }
}

// ── Claims ────────────────────────────────────────────────────────────────────
export async function getClaims(workerId) {
  try {
    const url = workerId ? `/claims?workerId=${workerId}` : "/claims";
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load claims"));
  }
}

export async function createClaim(payload) {
  try {
    const { data } = await api.post("/claims", payload);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to submit claim"));
  }
}

export async function updateClaimStatus(claimId, status) {
  try {
    const { data } = await api.put(`/claims/${claimId}/status`, { status });
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to update claim status"));
  }
}

// ── Payments ──────────────────────────────────────────────────────────────────
export async function getPayments(workerId) {
  try {
    const url = workerId ? `/payments?workerId=${workerId}` : "/payments";
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load payments"));
  }
}

// ── Admin Analytics ───────────────────────────────────────────────────────────
export async function getRiskDistribution() {
  try {
    const { data } = await api.get("/admin/analytics/risk");
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load risk distribution"));
  }
}

export async function getClaimStatusBreakdown() {
  try {
    const { data } = await api.get("/admin/analytics/claims");
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load claim breakdown"));
  }
}

// ── Fraud Alerts ──────────────────────────────────────────────────────────────
// FIXED: was /fraud-alerts — now AdminController maps it to /fraud-alerts (no /admin prefix)
export async function getFraudAlerts() {
  try {
    const { data } = await api.get("/fraud-alerts");
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, "Unable to load fraud alerts"));
  }
}

export default api;