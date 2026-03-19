import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Tooltip } from "recharts";

import Panel from "@/components/Panel";

const pieColors = ["#0ea5e9", "#f59e0b", "#ef4444"];

export function MinimalBarChart({ title, subtitle, data }) {
  return (
    <Panel className="p-6">
      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{subtitle}</h3>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
            <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

export function MinimalPieChart({ title, subtitle, data }) {
  return (
    <Panel className="p-6">
      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{subtitle}</h3>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px" }} />
            <Pie data={data} dataKey="value" innerRadius={56} outerRadius={82} paddingAngle={4}>
              {data.map((entry, index) => <Cell key={entry.name || entry.label} fill={pieColors[index % pieColors.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
