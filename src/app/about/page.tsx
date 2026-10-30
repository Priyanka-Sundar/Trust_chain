import { PageHeader } from "@/components/PageHeader";
import methodologyData from "@/../public/data/methodology.json";
import { ShieldCheck, AlertTriangle, FlaskConical } from "lucide-react";

export default function AboutPage() {
  const m = methodologyData as any;

  return (
    <div>
      <PageHeader
        title="Methodology"
        subtitle="The 15-stage Trust Chain pipeline, its limitations and the reproducibility checklist."
        badge="About"
      />

      <div className="page-card mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-400/15 text-terracotta-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-ink-900">Trust Chain</h3>
            <p className="text-sm text-ink-900/60 mt-0.5">
              AI-Driven Consumer Complaint Intelligence for E-commerce Platforms — a hybrid
              Transformer + Graph Neural Network pipeline with SHAP explainability on Yelp reviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <Meta label="Course" value="SWE1017 NLP" />
          <Meta label="Professor" value="Dr. Manjula V" />
          <Meta label="Semester" value="Fall 2026-27" />
          <Meta label="Team" value="Priyanka S · Kavya N" />
        </div>
      </div>

      <div className="page-card mb-6">
        <h3 className="font-serif text-lg text-ink-900 mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-sage-600" /> Pipeline Stages
        </h3>
        <div className="space-y-2">
          {m.pipeline_stages.map((s: any) => (
            <div key={s.stage} className="flex items-start gap-4 bg-cream-50 rounded-xl p-3 border border-cream-200">
              <div className="w-8 h-8 rounded-lg bg-ink-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {s.stage}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-ink-900">{s.name}</p>
                <p className="text-xs text-ink-900/60 mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-card mb-6">
        <h3 className="font-serif text-lg text-ink-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-gold-500" /> Limitations
        </h3>
        <ul className="space-y-2">
          {m.limitations.map((l: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-900/70 bg-cream-50 rounded-xl p-3 border border-cream-200">
              <span className="text-gold-500 mt-0.5">•</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="page-card">
        <h3 className="font-serif text-lg text-ink-900 mb-4">Reproducibility Checklist</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Meta label="Random seed" value={String(m.reproducibility.seed)} />
          <Meta label="Python" value={m.reproducibility.python_version} />
          <Meta label="Data source" value={m.reproducibility.data_source} />
        </div>
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold mb-2">Key library versions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(m.reproducibility.key_versions).map(([k, v]: [string, any]) => (
              <div key={k} className="bg-cream-50 rounded-lg p-2.5 border border-cream-200">
                <p className="text-[10px] uppercase tracking-wider text-ink-900/40 font-semibold">{k}</p>
                <p className="text-xs font-mono text-ink-900 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
      <p className="text-[10px] uppercase tracking-wider text-ink-900/50 font-semibold">{label}</p>
      <p className="text-sm font-medium text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}
