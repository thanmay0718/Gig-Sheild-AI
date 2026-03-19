import { useCallback, useMemo, useState } from "react";

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Progress from "@/components/ui/progress";
import Textarea from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useApiResource } from "@/hooks/useApiResource";
import { createClaim, getClaims, getPolicies } from "@/services/api";
import { policyPlans, workerClaims } from "@/utils/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";

const steps = ["Select policy", "Claim details", "Submit"];

// Backend: { id, description, claimDate, amount, status, disruptionType }
// Frontend needs: { id, reason, date, amount, status }
function normalizeClaim(claim) {
  return {
    id: claim.id ?? `CLM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    reason: claim.description || claim.reason || claim.disruptionType || "—",
    date: claim.claimDate || claim.date || null,
    amount: claim.amount ?? 0,
    status: claim.status || "Pending",
  };
}

// Backend: { id, policyType, premium, weeklyPremium, coverageAmount }
// Frontend needs: { id, name, premium, coverage, duration, recommended }
function normalizePolicy(policy) {
  return {
    id: String(policy.id),
    name: policy.policyType || policy.name || "Policy",
    premium: policy.weeklyPremium || policy.premium || 0,
    coverage: policy.coverageAmount || policy.coverage || 0,
    duration: "7 days",
    recommended: false,
  };
}

export default function WorkerClaims() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    policyId: "",
    description: "",
    amount: "",
    location: "",
    disruptionType: "WEATHER",
  });

  const fetchClaims = useCallback(async () => {
    if (!user?.workerId) return workerClaims;
    const response = await getClaims(user.workerId);
    if (Array.isArray(response) && response.length) {
      return response.map(normalizeClaim);
    }
    return workerClaims;
  }, [user?.workerId]);

  const fetchPolicies = useCallback(async () => {
    const response = await getPolicies();
    if (Array.isArray(response) && response.length) {
      return response.map(normalizePolicy);
    }
    return policyPlans;
  }, []);

  const { data: claims, setData: setClaims } = useApiResource(fetchClaims, workerClaims);
  const { data: policies } = useApiResource(fetchPolicies, policyPlans);
  const progressValue = useMemo(() => (currentStep / steps.length) * 100, [currentStep]);

  async function handleSubmit(event) {
    event.preventDefault();

    // Validation
    if (!form.description.trim()) {
      toast.error("Please describe what happened");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid claim amount");
      return;
    }

    setSubmitting(true);
    try {
      // ── FIXED: payload matches ClaimRequestDTO exactly ─────────────────────
      // ClaimRequestDTO: { workerId, policyId, description, amount, location, disruptionType }
      const payload = {
        workerId: user?.workerId ?? null,
        policyId: form.policyId ? Number(form.policyId) : null,
        description: form.description.trim(),
        amount: Number(form.amount),
        location: form.location.trim() || "",
        disruptionType: form.disruptionType || "WEATHER",
      };

      const response = await createClaim(payload);

      // Add normalized claim to list immediately
      setClaims((current) => [normalizeClaim(response), ...current]);

      toast.success("Claim submitted successfully!");
      setCurrentStep(3);
      setForm({ policyId: form.policyId, description: "", amount: "", location: "", disruptionType: "WEATHER" });
    } catch (error) {
      toast.error(error.message || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Claims"
        title="Submit and monitor claims with less friction"
        description="A simple multi-step form with readable status states."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Claim progress</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Three-step submission</h3>
            </div>
            <p className="text-sm text-zinc-500">Step {currentStep} of {steps.length}</p>
          </div>
          <div className="mt-6"><Progress value={progressValue} /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">0{index + 1}</p>
                <p className="mt-2 text-sm text-white">{step}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Step 1: Select policy */}
            <select
              value={form.policyId}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, policyId: e.target.value }));
                setCurrentStep(2);
              }}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none"
            >
              <option value="">Select a policy</option>
              {policies.map((policy) => (
                <option key={policy.id} value={policy.id}>{policy.name}</option>
              ))}
            </select>

            {/* Step 2: Claim details */}
            <Input
              placeholder="Claim amount (₹)"
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) => setForm((cur) => ({ ...cur, amount: e.target.value }))}
              required
            />
            <Input
              placeholder="Location (e.g. Hyderabad)"
              value={form.location}
              onChange={(e) => setForm((cur) => ({ ...cur, location: e.target.value }))}
            />
            <select
              value={form.disruptionType}
              onChange={(e) => setForm((cur) => ({ ...cur, disruptionType: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none"
            >
              <option value="WEATHER">Weather disruption</option>
              <option value="FLOOD">Flood</option>
              <option value="RAIN">Heavy rain</option>
              <option value="CURFEW">Curfew / lockdown</option>
              <option value="STRIKE">Strike</option>
              <option value="OTHER">Other</option>
            </select>
            <Textarea
              rows={4}
              placeholder="Describe what happened..."
              value={form.description}
              onChange={(e) => {
                setForm((cur) => ({ ...cur, description: e.target.value }));
                setCurrentStep(2);
              }}
              required
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Claim"}
            </Button>
          </form>
        </Panel>

        <Panel className="p-6">
          <p className="text-sm text-zinc-500">Latest submissions</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Claim status</h3>
          <div className="mt-6 space-y-4">
            {claims.length === 0 && (
              <p className="text-sm text-zinc-500">No claims submitted yet.</p>
            )}
            {claims.map((claim) => (
              <div key={claim.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{claim.reason}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDate(claim.date) || "—"}
                    </p>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-4 text-sm text-zinc-400">
                  Amount: <span className="text-white">{formatCurrency(claim.amount)}</span>
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}