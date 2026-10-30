import { PageHeader } from "@/components/PageHeader";
import signalsData from "@/../public/data/signals.json";

export default function SignalsPage() {
  const s = signalsData as any;
  const groupColors: Record<string, string> = {
    Semantic: "bg-dusty-400/15 text-dusty-500",
    Graph: "bg-sage-400/15 text-sage-600",
    "Graph degree": "bg-sage-400/15 text-sage-600",
    Sentiment: "bg-terracotta-400/15 text-terracotta-500",
    Metadata: "bg-gold-400/15 text-gold-500",
  };

  return (
    <div>
      <PageHeader
        title="Signals Reference"
        subtitle="The feature dictionary, verdict cascade, priority bands and likelihood bands behind every Trust Chain output."
        badge="Reference"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Feature Groups</h3>
          <p className="text-xs text-ink-900/50 mb-4">Dimensions contributed by each representation family to the fused feature vector.</p>
          <div className="space-y-2">
            {s.feature_groups.map((g: any) => (
              <div key={g.group} className="flex items-center justify-between bg-cream-50 rounded-xl p-3 border border-cream-200">
                <div>
                  <span className="font-medium text-ink-900 text-sm">{g.group}</span>
                  {g.description && <p className="text-xs text-ink-900/40 mt-0.5">{g.description}</p>}
                </div>
                <span className="text-lg font-bold text-terracotta-500">{g.dimensions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Pseudo-Label Validation</h3>
          <p className="text-xs text-ink-900/50 mb-4">Heuristic stability check against a stricter rule (n={s.pseudo_label_validation.sample_size}).</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200 text-center">
              <p className="text-2xl font-bold text-sage-600">{(s.pseudo_label_validation.precision * 100).toFixed(1)}%</p>
              <p className="text-xs text-ink-900/50 mt-1">Precision</p>
            </div>
            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200 text-center">
              <p className="text-2xl font-bold text-gold-500">{(s.pseudo_label_validation.recall * 100).toFixed(1)}%</p>
              <p className="text-xs text-ink-900/50 mt-1">Recall</p>
            </div>
            <div className="bg-cream-50 rounded-xl p-3 border border-cream-200 text-center">
              <p className="text-2xl font-bold text-terracotta-500">{(s.pseudo_label_validation.f1 * 100).toFixed(1)}%</p>
              <p className="text-xs text-ink-900/50 mt-1">F1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card mb-6">
        <h3 className="font-serif text-lg text-ink-900 mb-1">Component Table</h3>
        <p className="text-xs text-ink-900/50 mb-4">Top contributing features, their group, firing rate and SHAP-style weight.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-300 text-left">
                <th className="py-2 px-3 text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Feature</th>
                <th className="py-2 px-3 text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Group</th>
                <th className="py-2 px-3 text-xs uppercase tracking-wider text-ink-900/50 font-semibold text-right">Firing rate</th>
                <th className="py-2 px-3 text-xs uppercase tracking-wider text-ink-900/50 font-semibold text-right">Weight</th>
                <th className="py-2 px-3 text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {s.components.map((c: any) => (
                <tr key={c.name} className="table-row">
                  <td className="py-2.5 px-3 font-mono text-xs text-ink-900">{c.name}</td>
                  <td className="py-2.5 px-3">
                    <span className={`pill ${groupColors[c.group] || "bg-cream-200 text-ink-900/60"}`}>{c.group}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink-900/70">{(c.firing_rate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-terracotta-500">{c.weight ? c.weight.toFixed(3) : "—"}</td>
                  <td className="py-2.5 px-3 text-xs text-ink-900/60">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Verdict Cascade</h3>
          <div className="space-y-2">
            {s.verdict_cascade.map((v: any) => (
              <div key={v.order} className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-white text-[10px] font-bold flex items-center justify-center">{v.order}</span>
                  <span className="font-medium text-sm text-ink-900">{v.branch}</span>
                </div>
                <p className="text-xs text-ink-900/50 ml-7">{v.rule}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Priority Bands</h3>
          <div className="space-y-2">
            {s.priority_bands.map((b: any) => (
              <div key={b.tier} className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-ink-900">{b.tier}</span>
                  <span className="text-xs font-mono text-ink-900/50">{b.score_range}</span>
                </div>
                <p className="text-xs text-ink-900/50">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Likelihood Bands</h3>
          <div className="space-y-2">
            {s.likelihood_bands.map((b: any) => (
              <div key={b.band} className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-ink-900">{b.band}</span>
                  <span className="text-xs font-mono text-ink-900/50">{b.range}</span>
                </div>
                <p className="text-xs text-ink-900/50">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
