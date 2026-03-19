import { useCallback, useState } from "react";               // ADDED: useState for dismiss

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/button";                  // ADDED: action buttons
import { toast } from "@/components/ui/sonner";               // ADDED: feedback on action
import { useApiResource } from "@/hooks/useApiResource";      // ADDED: fetch from backend
import { getFraudAlerts } from "@/services/api";
import { fraudAlerts } from "@/utils/mockData";
import { formatRelativeTime } from "@/utils/formatters";      // ADDED: relative time format

export default function FraudAlerts() {

  // ADDED: fetch real fraud alerts, fall back to mock if empty
  const fetchAlerts = useCallback(async () => {
    const response = await getFraudAlerts();
    return Array.isArray(response) && response.length ? response : fraudAlerts;
  }, []);

  const { data: alerts, setData: setAlerts } = useApiResource(fetchAlerts, fraudAlerts);
  // CHANGED: was hardcoded fraudAlerts mock, now uses real fetched alerts

  // ADDED: dismiss an alert from the queue after admin reviews it
  async function handleDismiss(alertId) {
    try {
      // REPLACE WITH → DELETE /api/fraud-alerts/{id} when backend is ready
      setAlerts((current) => current.filter((a) => a.id !== alertId));
      toast.success("Alert dismissed");
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ADDED: mark alert as under investigation
  async function handleInvestigate(alertId) {
    try {
      // REPLACE WITH → PATCH /api/fraud-alerts/{id}/investigate when backend is ready
      setAlerts((current) =>
        current.map((a) =>
          a.id === alertId ? { ...a, severity: "Investigating" } : a
        )
      );
      toast.success("Marked as under investigation");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Fraud alerts"
        title="A restrained queue for suspicious patterns"
        description="Readable, triage-ready fraud alerts with severity and worker context."
      />
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Panel key={alert.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold text-white">{alert.title}</p>
                  <StatusBadge status={alert.severity} />
                </div>
                <p className="mt-3 text-sm text-zinc-400">Worker: {alert.worker}</p>
              </div>
              <div className="flex items-center gap-4">
                {/* CHANGED: was plain text time, now formatted relative time */}
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  {formatRelativeTime(alert.time) || alert.time}
                </p>
                {/* ADDED: action buttons for admin triage */}
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => handleInvestigate(alert.id)}
                >
                  Investigate
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs text-zinc-500"
                  onClick={() => handleDismiss(alert.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Panel>
        ))}

        {/* ADDED: empty state when all alerts are dismissed */}
        {alerts.length === 0 && (
          <Panel className="p-6">
            <p className="text-sm text-zinc-500">No active fraud alerts. Queue is clear.</p>
          </Panel>
        )}
      </div>
    </div>
  );
}