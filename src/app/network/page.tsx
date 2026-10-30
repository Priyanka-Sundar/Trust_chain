"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import networkData from "@/../public/data/network_data.json";
import { Users, Store, TrendingUp } from "lucide-react";

interface GNode { id: string; type: string; degree: number; pseudo_rate: number }
interface GEdge { source: string; target: string; weight: number; stars: number }

export default function NetworkPage() {
  const data = networkData as any;
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes: GNode[] = data.nodes;
  const edges: GEdge[] = data.edges;

  const W = 760;
  const H = 560;
  const cx = W / 2;
  const cy = H / 2;
  const userR = 180;
  const bizR = 220;

  const layout = useMemo(() => {
    const users = nodes.filter((n) => n.type === "user");
    const biz = nodes.filter((n) => n.type === "business");
    const positions: Record<string, { x: number; y: number }> = {};
    users.forEach((u, i) => {
      const angle = (i / users.length) * Math.PI * 2;
      positions[u.id] = { x: cx + Math.cos(angle) * userR, y: cy + Math.sin(angle) * userR };
    });
    biz.forEach((b, i) => {
      const angle = (i / biz.length) * Math.PI * 2 + Math.PI / biz.length;
      positions[b.id] = { x: cx + Math.cos(angle) * bizR, y: cy + Math.sin(angle) * bizR };
    });
    return positions;
  }, [nodes]);

  const userNodes = nodes.filter((n) => n.type === "user");
  const bizNodes = nodes.filter((n) => n.type === "business");
  const topSuspects = [...userNodes].sort((a, b) => b.pseudo_rate - a.pseudo_rate).slice(0, 8);

  const maxDeg = Math.max(...nodes.map((n) => n.degree));

  return (
    <div>
      <PageHeader
        title="Reviewer Network Graph"
        subtitle="User-business interaction graph with Node2Vec embeddings. Node size = degree, colour = pseudo-label rate."
        badge="Interactive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <StatBox icon={<Users className="w-5 h-5" />} label="User nodes" value={String(userNodes.length)} accent="text-dusty-500" />
        <StatBox icon={<Store className="w-5 h-5" />} label="Business nodes" value={String(bizNodes.length)} accent="text-sage-600" />
        <StatBox icon={<TrendingUp className="w-5 h-5" />} label="Edges" value={String(edges.length)} accent="text-gold-500" />
        <StatBox icon={<Users className="w-5 h-5" />} label="Max degree" value={String(maxDeg)} accent="text-terracotta-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="page-card lg:col-span-2">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Interaction Graph</h3>
          <p className="text-xs text-ink-900/50 mb-4">Hover any node to highlight its connections. Users sit on the inner ring, businesses on the outer.</p>
          <div className="bg-cream-50 rounded-xl p-2 border border-cream-200 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
              {edges.map((e, i) => {
                const sp = layout[e.source];
                const tp = layout[e.target];
                if (!sp || !tp) return null;
                const isHovered = hovered === e.source || hovered === e.target;
                return (
                  <line
                    key={i}
                    x1={sp.x} y1={sp.y} x2={tp.x} y2={tp.y}
                    stroke={isHovered ? "#C0392B" : "#D4C5A9"}
                    strokeWidth={isHovered ? 1.5 : 0.5}
                    opacity={isHovered ? 0.8 : 0.3}
                  />
                );
              })}
              {nodes.map((n) => {
                const p = layout[n.id];
                if (!p) return null;
                const r = 4 + (n.degree / maxDeg) * 8;
                const isUser = n.type === "user";
                const color = isUser ? (n.pseudo_rate > 0.2 ? "#C0392B" : "#9B82B0") : "#6FA058";
                const isHovered = hovered === n.id;
                return (
                  <g key={n.id} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}>
                    <circle cx={p.x} cy={p.y} r={r} fill={color} opacity={isHovered ? 1 : 0.7} stroke={isHovered ? "#1A1A1A" : "none"} strokeWidth={1.5} />
                    {isHovered && (
                      <text x={p.x} y={p.y - r - 4} textAnchor="middle" fontSize={9} fill="#1A1A1A" fontWeight="bold">
                        {n.id.slice(0, 8)}...
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-dusty-500" /> User</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-terracotta-500" /> High-suspicion user</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-sage-500" /> Business</div>
          </div>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Top Suspects</h3>
          <p className="text-xs text-ink-900/50 mb-4">Reviewers ranked by pseudo-label rate.</p>
          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {topSuspects.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 bg-cream-50 rounded-xl p-2.5 border border-cream-200">
                <span className="w-7 h-7 rounded-lg bg-terracotta-500/15 text-terracotta-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-ink-900 truncate">{u.id}</p>
                  <p className="text-[10px] text-ink-900/50">Degree {u.degree}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-terracotta-500">{(u.pseudo_rate * 100).toFixed(0)}%</p>
                  <p className="text-[10px] text-ink-900/40">suspicious</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="stat-card">
      <div className={`${accent} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-900/50 mt-0.5">{label}</p>
    </div>
  );
}
