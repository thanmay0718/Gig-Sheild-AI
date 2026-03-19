import Panel from "@/components/Panel";

export default function MetricCard({ title, value, detail }) {
  return (
    <Panel className="p-5 transition duration-300 hover:-translate-y-1">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-5 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </Panel>
  );
}
