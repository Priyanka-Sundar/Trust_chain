"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import compareData from "@/../public/data/compare_data.json";
import { GitCompare, ArrowRight } from "lucide-react";

export default function ComparePage() {
  const cases = (compareData as any).cases as any[];
  const [leftId, setLeftId] = useState(cases[0]?.case_id || "");
  const [rightId, setRightId] = useState(cases[1]?.case_id || "");

  const left = cases.find((c) => c.case_id === leftId);
  const right = cases.find((c) => c.case_id === rightId);

  const diffs: { label: string; left: string; right: string; highlight: boolean }[] = left && right ? [
    { label: "Model probability", left: left.model_proba.toFixed(3), right: right.model_proba.toFixed(3), highlight: Math.abs(left.model_proba - right.model_proba) > 0.2 },
    { label: "Suspect score", left: `${left.suspect_score}/7`, right: `${right.suspect_score}/7`, highlight: left.suspect_score !== right.suspect_score },
    { label: "Stars", left: String(left.stars), right: String(right.stars), highlight: left.stars !== right.stars },
    { label: "VADER compound", left: left.vader_compound.toFixed(3), right: right.vader_compound.toFixed(3), highlight: Math.abs(left.vader_compound - right.vader_compound) > 0.3 },
    { label: "User degree", left: String(left.user_deg), right: String(right.user_deg), highlight: Math.abs(left.user_deg - right.user_deg) > 5 },
    { label: "Business degree", left: String(left.biz_deg), right: String(right.biz_deg), highlight: Math.abs(left.biz_deg - right.biz_deg) > 10 },
    { label: "Text length", left: `${left.text_len} chars`, right: `${right.text_len} chars`, highlight: Math.abs(left.text_len - right.text_len) > 100 },
    { label: "Verdict", left: left.model_proba >= 0.5 ? "Suspicious" : "Routine", right: right.model_proba >= 0.5 ? "Suspicious" : "Routine", highlight: (left.model_proba >= 0.5) !== (right.model_proba >= 0.5) },
  ] : [];

  return (
    <div>
      <PageHeader
        title="Compare Cases"
        subtitle="Place any two cases side by side and see exactly where the model diverges."
        badge="Diff view"
      />

      <div className="page-card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <select value={leftId} onChange={(e) => setLeftId(e.target.value)} className="input-field">
            {cases.map((c) => (
              <option key={c.case_id} value={c.case_id}>{c.case_id} — {c.text.slice(0, 50)}...</option>
            ))}
          </select>
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-cream-200 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-ink-900/60" />
            </div>
          </div>
          <select value={rightId} onChange={(e) => setRightId(e.target.value)} className="input-field">
            {cases.map((c) => (
              <option key={c.case_id} value={c.case_id}>{c.case_id} — {c.text.slice(0, 50)}...</option>
            ))}
          </select>
        </div>
      </div>

      {left && right && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[
            { c: left, label: "Left", color: "terracotta" },
            { c: right, label: "Right", color: "dusty" },
          ].map(({ c, label, color }) => (
            <div key={label} className="page-card">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-ink-900/50">{c.case_id}</span>
                <span className={`pill ${c.model_proba >= 0.5 ? "pill-suspicious" : "pill-routine"}`}>
                  {c.model_proba >= 0.5 ? "Suspicious" : "Routine"}
                </span>
              </div>
              <p className="text-sm text-ink-900/80 leading-relaxed mb-4 italic">&ldquo;{c.text}&rdquo;</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gold-500 font-medium">★ {c.stars}</span>
                <span className="text-ink-900/50">{c.date}</span>
                <span className="text-ink-900/50">{c.text_len} chars</span>
              </div>
              <div className="mt-3 pt-3 border-t border-cream-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-900/50">Probability</span>
                  <span className="font-bold text-terracotta-500">{c.model_proba.toFixed(3)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-card">
        <h3 className="font-serif text-lg text-ink-900 mb-1">Difference Summary</h3>
        <p className="text-xs text-ink-900/50 mb-4">Highlighted rows show where the two cases diverge meaningfully.</p>
        <div className="space-y-1.5">
          {diffs.map((d) => (
            <div
              key={d.label}
              className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5 rounded-xl ${
                d.highlight ? "bg-terracotta-400/10 border border-terracotta-400/30" : "bg-cream-50"
              }`}
            >
              <span className="text-sm font-medium text-ink-900 text-right">{d.left}</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider text-ink-900/40 font-semibold">{d.label}</span>
                {d.highlight && <ArrowRight className="w-3 h-3 text-terracotta-500" />}
              </div>
              <span className="text-sm font-medium text-ink-900">{d.right}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
