import { useCallback } from "react";                          // ADDED: for useCallback

import { MinimalBarChart, MinimalPieChart } from "@/components/ChartCard";
import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import { useApiResource } from "@/hooks/useApiResource";      // ADDED: fetch from backend
import { claimStatusBreakdown, riskDistribution } from "@/utils/mockData";

// ADDED: real API calls for analytics
// Add these two functions to services/api.js:
// export async function getRiskDistribution() {
//   const { data } = await api.get("/admin/analytics/risk");
//   return data;
// }
// export async function getClaimStatusBreakdown() {
//   const { data } = await api.get("/admin/analytics/claims");
//   return data;
// }
import {
  getClaimStatusBreakdown,
  getRiskDistribution,
} from "@/services/api";

export default function Analytics() {

  // ADDED: fetch real risk distribution, fall back to mock if empty
  const fetchRisk = useCallback(async () => {
    const response = await getRiskDistribution();
    return Array.isArray(response) && response.length ? response : riskDistribution;
  }, []);

  // ADDED: fetch real claim breakdown, fall back to mock if empty
  const fetchClaims = useCallback(async () => {
    const response = await getClaimStatusBreakdown();
    return Array.isArray(response) && response.length ? response : claimStatusBreakdown;
  }, []);

  const { data: riskData } = useApiResource(fetchRisk, riskDistribution);
  const { data: claimData } = useApiResource(fetchClaims, claimStatusBreakdown);
  // CHANGED: was hardcoded mock, now uses real fetched data with mock fallback

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Analytics"
        title="Minimal charts for high-signal decisions"
        description="Only the analytics that matter: risk mix and claim outcome mix."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {/* CHANGED: was riskDistribution mock, now riskData from backend */}
        <MinimalBarChart
          title="Risk bands"
          subtitle="Distribution of workers by risk"
          data={riskData}
        />
        {/* CHANGED: was claimStatusBreakdown mock, now claimData from backend */}
        <MinimalPieChart
          title="Claim outcomes"
          subtitle="Approved vs pending vs rejected"
          data={claimData}
        />
      </div>
      <Panel className="p-6">
        <p className="text-sm leading-7 text-zinc-400">
          This analytics view intentionally avoids chart overload. The goal is fast platform comprehension.
        </p>
      </Panel>
    </div>
  );
}