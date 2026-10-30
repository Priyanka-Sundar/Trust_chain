"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import casesData from "@/../public/data/cases.json";
import { Search, Download, ChevronDown, Star } from "lucide-react";

type Tier = "high" | "medium" | "low";

function tierOf(proba: number): Tier {
  if (proba >= 0.7) return "high";
  if (proba >= 0.4) return "medium";
  return "low";
}

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const cases = (casesData as any).cases as any[];

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (tierFilter !== "all" && tierOf(c.model_proba) !== tierFilter) return false;
      if (search && !c.text.toLowerCase().includes(search.toLowerCase()) && !c.case_id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cases, search, tierFilter]);

  return (
    <div>
      <PageHeader
        title="Case Queue"
        subtitle={`${cases.length} priority-sorted cases from the held-out test set.`}
        badge={`${filtered.length} shown`}
      />

      <div className="page-card mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case ID or review text..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "high", "medium", "low"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                  tierFilter === t ? "bg-ink-900 text-white" : "bg-cream-100 text-ink-900/60 hover:bg-cream-200"
                }`}
              >
                {t === "all" ? "All tiers" : `${t} priority`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.slice(0, 50).map((c) => {
          const tier = tierOf(c.model_proba);
          const isOpen = expanded === c.case_id;
          const tierColor = tier === "high" ? "pill-strong" : tier === "medium" ? "pill-moderate" : "pill-routine";
          return (
            <div key={c.case_id} className="bg-white rounded-xl border border-cream-200 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : c.case_id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-cream-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-ink-900/60">{c.case_id.split("-")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-900/50">{c.case_id}</span>
                    <span className={`pill ${tierColor}`}>{tier} priority</span>
                    <span className="flex items-center gap-0.5 text-xs text-gold-500">
                      <Star className="w-3 h-3 fill-current" /> {c.stars}
                    </span>
                  </div>
                  <p className="text-sm text-ink-900/70 mt-1 truncate">{c.text}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-terracotta-500">{c.model_proba.toFixed(3)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-900/40">proba</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-ink-900/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="border-t border-cream-200 p-4 bg-cream-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold mb-1.5">Full review text</p>
                    <p className="text-sm text-ink-900/80 leading-relaxed">{c.text}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const report = `CASE REPORT: ${c.case_id}\n\nDate: ${c.date}\nStars: ${c.stars}\nUser: ${c.user_id}\nBusiness: ${c.business_id}\nModel probability: ${c.model_proba}\nSuspect score: ${c.suspect_score}\nVerdict: ${c.model_proba >= 0.5 ? "Suspicious" : "Routine"}\n\n--- Review Text ---\n${c.text}`;
                          const blob = new Blob([report], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${c.case_id}_report.txt`;
                          a.click();
                        }}
                        className="btn-secondary text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Export
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Detail label="Suspect score" value={`${c.suspect_score} / 7`} />
                    <Detail label="VADER compound" value={c.vader_compound.toFixed(3)} />
                    <Detail label="User degree" value={String(c.user_deg)} />
                    <Detail label="Business degree" value={String(c.biz_deg)} />
                    <Detail label="Text length" value={`${c.text_len} chars`} />
                    <Detail label="Date" value={c.date} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-cream-200">
      <span className="text-xs text-ink-900/50">{label}</span>
      <span className="text-sm font-medium text-ink-900">{value}</span>
    </div>
  );
}
