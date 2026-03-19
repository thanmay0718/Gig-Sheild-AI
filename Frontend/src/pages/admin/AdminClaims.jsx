import { useCallback, useState } from "react";               // ADDED: useState for action loading

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";              // ADDED: toast feedback
import { useApiResource } from "@/hooks/useApiResource";     // ADDED: fetch from backend
import { getClaims } from "@/services/api";                  // ADDED: real API call
import { workerClaims } from "@/utils/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters"; // ADDED: formatDate

// ADDED: add this function to services/api.js:
// export async function updateClaimStatus(claimId, status) {
//   const { data } = await api.put(`/claims/${claimId}/status`, { status });
//   return data;
// }
import { updateClaimStatus } from "@/services/api";          // ADDED: approve/reject API

export default function AdminClaims() {
  const [actioningId, setActioningId] = useState(null);      // ADDED: track which claim is actioning

  // ADDED: fetch ALL claims for admin (no workerId filter)
  const fetchClaims = useCallback(async () => {
    const response = await getClaims();                       // no workerId = fetch all
    return Array.isArray(response) && response.length ? response : workerClaims;
  }, []);

  const { data: claims, setData: setClaims } = useApiResource(fetchClaims, workerClaims);

  // ADDED: handles both approve and reject with one function
  async function handleAction(claimId, status) {
    setActioningId(claimId);
    try {
      await updateClaimStatus(claimId, status);              // ADDED: hits backend

      // ADDED: update UI instantly without refetch
      setClaims((current) =>
        current.map((claim) =>
          claim.id === claimId ? { ...claim, status } : claim
        )
      );
      toast.success(`Claim ${claimId} ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Claims review"
        title="Approve or reject claims from a clean review surface"
        description="Compact rows, clear status badges, and decisive actions."
      />
      <div className="space-y-4">
        {claims.map((claim) => (
          <Panel key={claim.id} className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-white">{claim.id}</p>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{claim.reason}</p>
                <div className="mt-4 flex gap-5 text-sm text-zinc-500">
                  {/* CHANGED: formatDate on date field */}
                  <span>Date: {formatDate(claim.date) || claim.date}</span>
                  <span>Amount: {formatCurrency(claim.amount)}</span>
                </div>
              </div>
              {/* CHANGED: buttons now call handleAction, disabled while actioning */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={actioningId === claim.id || claim.status === "Rejected"}
                  onClick={() => handleAction(claim.id, "Rejected")}
                >
                  {actioningId === claim.id ? "..." : "Reject"}
                </Button>
                <Button
                  variant="primary"
                  disabled={actioningId === claim.id || claim.status === "Approved"}
                  onClick={() => handleAction(claim.id, "Approved")}
                >
                  {actioningId === claim.id ? "..." : "Approve"}
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}