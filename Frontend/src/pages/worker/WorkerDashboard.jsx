import { useCallback } from "react";

import MetricCard from "@/components/MetricCard";
import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useApiResource } from "@/hooks/useApiResource";
import { getClaims } from "@/services/api";
import { workerClaims, workerMetrics, workerTimeline } from "@/utils/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";

// Normalize claim from backend shape → frontend shape
// Backend: { id, description, claimDate, amount, status }
// Frontend expects: { id, reason, date, amount, status }
function normalizeClaim(claim) {
  return {
    id: claim.id || claim.claimId || `CLM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    reason: claim.reason || claim.description || claim.disruptionType || "—",
    date: claim.date || claim.claimDate || claim.createdAt || null,
    amount: claim.amount ?? 0,
    status: claim.status || "Pending",
  };
}

export default function WorkerDashboard() {
  const { user } = useAuth();

  const fetchClaims = useCallback(async () => {
    const response = await getClaims(user?.workerId);
    if (Array.isArray(response) && response.length) {
      return response.map(normalizeClaim);
    }
    return workerClaims;
  }, [user?.workerId]);

  const { data: claims } = useApiResource(fetchClaims, workerClaims);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Worker dashboard"
        title="A calm view of your active protection"
        description="Track policy health, claim progress, and current disruption exposure without clutter."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workerMetrics.map((item) => (
          <MetricCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Recent claims</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Status overview</h3>
            </div>
            <StatusBadge status="Pending" />
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-zinc-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Claim</th>
                  <th className="px-5 py-4 font-medium">Reason</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-t border-white/10 text-zinc-300">
                    <td className="px-5 py-4">{claim.id}</td>
                    <td className="px-5 py-4">{claim.reason}</td>
                    <td className="px-5 py-4">{formatCurrency(claim.amount)}</td>
                    <td className="px-5 py-4">
                      <span className="mr-3 text-xs text-zinc-500">
                        {formatDate(claim.date) || claim.date}
                      </span>
                      <StatusBadge status={claim.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-6">
          <h3 className="text-lg font-semibold text-white">Activity timeline</h3>
          <div className="mt-6 space-y-5">
            {workerTimeline.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" />
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-600">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}