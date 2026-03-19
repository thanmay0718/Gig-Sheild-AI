export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

// ADDED: format dates consistently across all pages
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));             // e.g. "18 Mar 2026"
}

// ADDED: format date + time for claims/fraud alerts timestamps
export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));             // e.g. "18 Mar 2026, 09:45 AM"
}

// ADDED: show "2 days ago" style relative time for notifications/alerts
export function formatRelativeTime(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;                   // used in FraudAlerts, AdminClaims
}

// ADDED: capitalize first letter of status strings from backend
// backend sends "ACTIVE", "PENDING" — display as "Active", "Pending"
export function formatStatus(status) {
  if (!status) return "—";
  return String(status).charAt(0).toUpperCase() +
    String(status).slice(1).toLowerCase();  // "APPROVED" → "Approved"
}

// ADDED: weekly premium display with per-week label
export function formatWeeklyPremium(value) {
  return `${formatCurrency(value)}/week`;   // e.g. "₹149/week"
}