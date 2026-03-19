import { useCallback } from "react";                          // ADDED: for useCallback

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import { useApiResource } from "@/hooks/useApiResource";      // ADDED: fetch from backend
import { getWorkers } from "@/services/api";                  // ADDED: real API call
import { adminWorkers } from "@/utils/mockData";

// ADDED: color-codes risk score so admin can spot high-risk workers instantly
function RiskBadge({ score }) {
  const color =
    score >= 70 ? "text-red-400 bg-red-500/10 border-red-500/20" :   // high risk
    score >= 40 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : // medium
                  "text-green-400 bg-green-500/10 border-green-500/20";  // low risk

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {score}
    </span>
  );
}

export default function AdminWorkers() {
  // ADDED: fetch real workers from backend, fall back to mock if empty
  const fetchWorkers = useCallback(async () => {
    const response = await getWorkers();
    return Array.isArray(response) && response.length ? response : adminWorkers;
  }, []);

  const { data: workers } = useApiResource(fetchWorkers, adminWorkers);
  // CHANGED: was hardcoded adminWorkers, now uses real fetched workers

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Workers"
        title="Monitor insured workers in one focused table"
        description="A minimal admin view for city, policy, risk score, and claim count."
      />
      <Panel className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">City</th>
              <th className="px-6 py-4 font-medium">Policy</th>
              <th className="px-6 py-4 font-medium">Risk</th>
              <th className="px-6 py-4 font-medium">Claims</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-t border-white/10 text-zinc-300">
                <td className="px-6 py-4 text-zinc-500">{worker.id}</td>
                <td className="px-6 py-4 font-medium text-white">{worker.name}</td>
                <td className="px-6 py-4">{worker.city}</td>
                <td className="px-6 py-4">{worker.policy}</td>
                {/* CHANGED: was plain number, now color-coded badge */}
                <td className="px-6 py-4">
                  <RiskBadge score={worker.risk} />
                </td>
                <td className="px-6 py-4">{worker.claims}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}