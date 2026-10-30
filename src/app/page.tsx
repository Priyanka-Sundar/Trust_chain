"use client";

import { PageHeader } from "@/components/PageHeader";
import { formatNumber, formatPct } from "@/lib/utils";
import dashboardData from "@/../public/data/dashboard_data.json";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from "recharts";
import { Users, Store, AlertTriangle, Clock, TrendingUp, Activity } from "lucide-react";

const verdictColors = ["#6FA058", "#C0392B"];
const priorityColors = ["#6FA058", "#E8C547", "#C0392B"];

export default function DashboardPage() {
  const d = dashboardData as any;

  return (
    <div>
      <PageHeader
        title="Population Dashboard"
        subtitle="Overview of 20,000 analysed consumer reviews across the Trust Chain corpus."
        badge="Live"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Reviews analysed"
          value={formatNumber(d.corpus_size)}
          accent="terracotta"
          sub={`${formatPct(d.positive_rate)} flagged suspicious`}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Unique reviewers"
          value={formatNumber(d.unique_users)}
          accent="dusty"
          sub="User-disjoint split enforced"
        />
        <StatCard
          icon={<Store className="w-5 h-5" />}
          label="Unique businesses"
          value={formatNumber(d.unique_businesses)}
          accent="sage"
          sub="User-business interaction graph"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pipeline runtime"
          value={`${Math.round(d.runtime_seconds.total_known)}s`}
          accent="gold"
          sub="CPU-friendly configuration"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="page-card lg:col-span-2">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Review Volume by Year</h3>
          <p className="text-xs text-ink-900/50 mb-4">Temporal distribution of consumer reviews across the corpus.</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.yearly_volume}>
              <defs>
                <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C0392B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C0392B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Area type="monotone" dataKey="count" stroke="#C0392B" strokeWidth={2} fill="url(#yearGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Verdict Mix</h3>
          <p className="text-xs text-ink-900/50 mb-4">Pseudo-label distribution.</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={d.verdict_mix} dataKey="cases" nameKey="verdict" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {d.verdict_mix.map((_: any, i: number) => (
                  <Cell key={i} fill={verdictColors[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Star Rating Distribution</h3>
          <p className="text-xs text-ink-900/50 mb-4">Full-corpus review counts by star value.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.rating_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="stars" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {d.rating_distribution.map((_: any, i: number) => (
                  <Cell key={i} fill={["#C0392B", "#D97852", "#E8C547", "#8FB87A", "#6FA058"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Investigation Priority Tiers</h3>
          <p className="text-xs text-ink-900/50 mb-4">Cases bucketed by suspect-score range.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.priority_tiers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: "#1A1A1A" }} width={90} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="cases" radius={[0, 8, 8, 0]}>
                {d.priority_tiers.map((_: any, i: number) => (
                  <Cell key={i} fill={priorityColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="page-card mb-6">
        <h3 className="font-serif text-lg text-ink-900 mb-1">Model Performance Snapshot</h3>
        <p className="text-xs text-ink-900/50 mb-4">
          Feature-fusion XGBoost vs GraphSAGE baseline on the held-out test set. Wilcoxon p = {d.model_summary.wilcoxon_p?.toFixed(4)}.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {["accuracy", "precision", "recall", "f1", "roc_auc", "pr_auc", "mcc"].map((metric) => {
            const ff = d.model_summary.feature_fusion.metrics[metric];
            const gs = d.model_summary.graph_sage.metrics[metric];
            return (
              <div key={metric} className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <p className="text-[10px] uppercase tracking-wider text-ink-900/50 font-semibold">{metric.replace("_", " ")}</p>
                <p className="text-lg font-bold text-terracotta-500 mt-1">{ff.toFixed(3)}</p>
                <p className="text-xs text-ink-900/40 mt-0.5">GNN {gs.toFixed(3)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="page-card">
        <h3 className="font-serif text-lg text-ink-900 mb-1">Pipeline Runtime by Stage</h3>
        <p className="text-xs text-ink-900/50 mb-4">Wall-clock seconds for each pipeline stage (CPU run).</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={Object.entries(d.runtime_seconds).map(([k, v]: [string, any]) => ({ stage: k, seconds: v }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
            <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#1A1A1A" }} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11, fill: "#1A1A1A" }} />
            <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
            <Bar dataKey="seconds" fill="#D97852" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  accent: "terracotta" | "dusty" | "sage" | "gold";
}) {
  const accents: Record<string, string> = {
    terracotta: "bg-terracotta-400/15 text-terracotta-500",
    dusty: "bg-dusty-400/15 text-dusty-500",
    sage: "bg-sage-400/15 text-sage-600",
    gold: "bg-gold-400/15 text-gold-500",
  };
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accents[accent]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-sm text-ink-900/70 font-medium mt-0.5">{label}</p>
      <p className="text-xs text-ink-900/40 mt-1">{sub}</p>
    </div>
  );
}
