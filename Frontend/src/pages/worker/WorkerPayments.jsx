import { useCallback } from "react";

import Panel from "@/components/Panel";
import SectionHeading from "@/components/SectionHeading";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useApiResource } from "@/hooks/useApiResource";
import { getPayments } from "@/services/api";
import { paymentHistory } from "@/utils/mockData";
import { formatCurrency, formatDate, formatStatus } from "@/utils/formatters";

// Normalize backend payment → frontend shape
// Backend: { id, workerId, amount, paymentType, paymentMethod, paymentStatus, paymentDate }
// Frontend: { id, plan, date, amount, status }
function normalizePayment(payment) {
  return {
    id: payment.id || `PAY-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    plan: payment.plan || payment.paymentType || payment.paymentMethod || "Premium",
    date: payment.date || payment.paymentDate || null,
    amount: payment.amount ?? 0,
    status: formatStatus(payment.status || payment.paymentStatus || "Paid"),
  };
}

export default function WorkerPayments() {
  const { user } = useAuth();

  const fetchPayments = useCallback(async () => {
    const response = await getPayments(user?.workerId);
    if (Array.isArray(response) && response.length) {
      return response.map(normalizePayment);
    }
    return paymentHistory;
  }, [user?.workerId]);

  const { data: payments } = useApiResource(fetchPayments, paymentHistory);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Payments"
        title="A simple ledger for policy payments"
        description="Review premium payments inside the same workspace."
      />
      <Panel className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-white/10 text-zinc-300">
                <td className="px-6 py-4">{payment.id}</td>
                <td className="px-6 py-4">{payment.plan}</td>
                <td className="px-6 py-4">
                  {formatDate(payment.date) || payment.date}
                </td>
                <td className="px-6 py-4">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-4"><StatusBadge status={payment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}