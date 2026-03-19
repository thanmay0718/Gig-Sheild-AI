// ─────────────────────────────────────────────────────────────
// MOCK DATA — Replace each section with real API calls once
// the corresponding backend endpoint is ready.
//
// Replacement map:
//   landingSteps / landingFeatures  → static, keep as-is forever
//   workerMetrics                   → GET /api/workers/{id}/dashboard
//   workerClaims                    → GET /api/claims?workerId={id}
//   workerTimeline                  → GET /api/workers/{id}/timeline
//   policyPlans                     → GET /api/policies/plans
//   paymentHistory                  → GET /api/payments?workerId={id}
//   adminMetrics                    → GET /api/admin/dashboard
//   adminWorkers                    → GET /api/workers
//   fraudAlerts                     → GET /api/fraud-alerts
//   riskDistribution                → GET /api/admin/analytics/risk
//   claimStatusBreakdown            → GET /api/admin/analytics/claims
// ─────────────────────────────────────────────────────────────

// STATIC — never needs a backend call
export const landingSteps = [
  { id: "01", title: "Create account", description: "Onboard workers or admins in a clean, role-based flow." },
  { id: "02", title: "Choose coverage", description: "Select a policy designed around earnings protection and live risk." },
  { id: "03", title: "Track and claim", description: "Monitor status, submit claims, and review payouts with clarity." }
];

// STATIC — never needs a backend call
export const landingFeatures = [
  { title: "AI risk intelligence", description: "Uses disruption signals to keep underwriting and monitoring responsive." },
  { title: "Claims with less friction", description: "Fast claim intake, readable status states, and simple admin review." },
  { title: "Premium dark workspace", description: "A calm, focused interface inspired by modern AI SaaS products." }
];

// REPLACE WITH → GET /api/workers/{id}/dashboard
export const workerMetrics = [
  { title: "Active Policy", value: "Monsoon Flex Pro", detail: "Valid until 24 Apr 2026" },
  { title: "Risk Score", value: "72 / 100", detail: "Moderate exposure this week" },
  { title: "Protected Earnings", value: "INR 48,000", detail: "30-day insured income" },
  { title: "Recent Claim", value: "Pending", detail: "Submitted 3 hours ago" }
];

// REPLACE WITH → GET /api/claims?workerId={id}
export const workerClaims = [
  { id: "CLM-3021", reason: "Heavy rainfall disruption", date: "17 Mar 2026", amount: 3200, status: "Pending" },
  { id: "CLM-2986", reason: "Air quality shutdown", date: "11 Mar 2026", amount: 2100, status: "Approved" },
  { id: "CLM-2874", reason: "Flash flood route block", date: "03 Mar 2026", amount: 4800, status: "Rejected" }
];

// REPLACE WITH → GET /api/workers/{id}/timeline
export const workerTimeline = [
  { title: "Rain threshold triggered", description: "South zone risk signal crossed the payout threshold.", time: "10 min ago" },
  { title: "Claim verification synced", description: "Shift logs and route snapshots attached successfully.", time: "1 hour ago" },
  { title: "Coverage renewed", description: "Policy renewed for another 30 days.", time: "Yesterday" }
];

// REPLACE WITH → GET /api/policies/plans
export const policyPlans = [
  { id: "starter", name: "Starter Shield", premium: 149, coverage: 15000, duration: "14 days", recommended: false },
  { id: "pro", name: "Monsoon Flex Pro", premium: 299, coverage: 40000, duration: "30 days", recommended: true },
  { id: "elite", name: "All-Weather Elite", premium: 499, coverage: 90000, duration: "45 days", recommended: false }
];

// REPLACE WITH → GET /api/payments?workerId={id}
export const paymentHistory = [
  { id: "PAY-901", plan: "Monsoon Flex Pro", amount: 299, date: "15 Mar 2026", status: "Paid" },
  { id: "PAY-882", plan: "Monsoon Flex Pro", amount: 299, date: "14 Feb 2026", status: "Paid" },
  { id: "PAY-853", plan: "Starter Shield", amount: 149, date: "30 Jan 2026", status: "Paid" }
];

// REPLACE WITH → GET /api/admin/dashboard
export const adminMetrics = [
  { title: "Total Workers", value: "3,842", detail: "+8.4% MoM" },
  { title: "Total Claims", value: "428", detail: "63 awaiting review" },
  { title: "Fraud Alerts", value: "12", detail: "4 urgent" },
  { title: "Risk Distribution", value: "Balanced", detail: "Moderate band dominant" }
];

// REPLACE WITH → GET /api/workers
export const adminWorkers = [
  { id: "WRK-101", name: "Aarav Singh", city: "Bengaluru", policy: "Monsoon Flex Pro", risk: 68, claims: 3 },
  { id: "WRK-102", name: "Priya Mehta", city: "Mumbai", policy: "Starter Shield", risk: 44, claims: 1 },
  { id: "WRK-103", name: "Kabir Das", city: "Delhi", policy: "All-Weather Elite", risk: 81, claims: 5 },
  { id: "WRK-104", name: "Nisha Rao", city: "Pune", policy: "Monsoon Flex Pro", risk: 59, claims: 2 }
];

// REPLACE WITH → GET /api/fraud-alerts
export const fraudAlerts = [
  { id: "FA-21", title: "Multiple claims from same GPS cluster", severity: "High", worker: "Kabir Das", time: "22 min ago" },
  { id: "FA-19", title: "Shift log mismatch with weather event", severity: "Medium", worker: "Aarav Singh", time: "1 hr ago" },
  { id: "FA-16", title: "Repeat claim pattern within 48 hours", severity: "Low", worker: "Nisha Rao", time: "Today" }
];

// REPLACE WITH → GET /api/admin/analytics/risk
export const riskDistribution = [
  { label: "Low", value: 34 },
  { label: "Moderate", value: 46 },
  { label: "High", value: 20 }
];

// REPLACE WITH → GET /api/admin/analytics/claims
export const claimStatusBreakdown = [
  { name: "Approved", value: 184 },
  { name: "Pending", value: 63 },
  { name: "Rejected", value: 27 }
];