"use client";

import { PageHeader } from "@/components/PageHeader";
import insightsData from "@/../public/data/model_insights.json";
import dashboardData from "@/../public/data/dashboard_data.json";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from "recharts";

export default function InsightsPage() {
  const m = insightsData as any;
  const d = dashboardData as any;

  const topFeatures = m.top_features.slice(0, 15).map((f: any) => ({
    name: f.feature,
    shap: Number(f.mean_abs_shap),
  }));

  const ffHistory = m.training_history.feature_fusion;
  const gsHistory = m.training_history.graph_sage;

  const foldSummary = m.fold_summary.map((row: any) => ({
    model: row.model,
    pr_auc: Number(row.pr_auc_mean),
    roc_auc: Number(row.roc_auc_mean),
    f1: Number(row.f1_mean),
    accuracy: Number(row.accuracy_mean),
  }));

  const rocData = d.roc_curves.feature_fusion.fpr.map((fpr: number, i: number) => ({
    fpr,
    tpr_ff: d.roc_curves.feature_fusion.tpr[i],
    tpr_gs: d.roc_curves.graph_sage.tpr[i] || 0,
  }));
  const prData = d.pr_curves.feature_fusion.recall.map((rec: number, i: number) => ({
    recall: rec,
    precision_ff: d.pr_curves.feature_fusion.precision[i],
    precision_gs: d.pr_curves.graph_sage.precision[i] || 0,
  }));

  return (
    <div>
      <PageHeader
        title="Model Insights"
        subtitle="SHAP feature importance, training curves, fold-level metrics and error analysis for both models."
        badge="XGBoost + GNN"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Top 15 Features by SHAP</h3>
          <p className="text-xs text-ink-900/50 mb-4">Mean absolute SHAP value across the test sample.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topFeatures} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#1A1A1A" }} width={80} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="shap" radius={[0, 8, 8, 0]} fill="#C0392B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">Cross-Validation Folds</h3>
          <p className="text-xs text-ink-900/50 mb-4">PR-AUC and ROC-AUC per fold for both models.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={foldSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis domain={[0.5, 1]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="pr_auc" name="PR-AUC" fill="#C0392B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roc_auc" name="ROC-AUC" fill="#6FA058" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">XGBoost Training Curve</h3>
          <p className="text-xs text-ink-900/50 mb-4">Validation AUCPR across boosting iterations.</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ffHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="iteration" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis domain={[0.6, 0.95]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="aucpr" stroke="#C0392B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-1">GraphSAGE Training Curve</h3>
          <p className="text-xs text-ink-900/50 mb-4">Validation PR-AUC across epochs.</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={gsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <YAxis domain={[0.5, 0.8]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="val_pr_auc" stroke="#6FA058" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="page-card mb-6">
        <h3 className="font-serif text-lg text-ink-900 mb-1">ROC &amp; Precision-Recall Curves</h3>
        <p className="text-xs text-ink-900/50 mb-4">Both models on the held-out test set.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-2">ROC</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
                <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
                <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="tpr_ff" name="Feature Fusion" stroke="#C0392B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tpr_gs" name="GraphSAGE" stroke="#6FA058" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-2">Precision-Recall</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={prData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
                <XAxis dataKey="recall" type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
                <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: "#1A1A1A" }} />
                <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="precision_ff" name="Feature Fusion" stroke="#C0392B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="precision_gs" name="GraphSAGE" stroke="#6FA058" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Accuracy by Length</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={m.error_analysis.by_length}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="len_bucket" tick={{ fontSize: 10, fill: "#1A1A1A" }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="correct" radius={[4, 4, 0, 0]}>
                {m.error_analysis.by_length.map((_: any, i: number) => <Cell key={i} fill="#9B82B0" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Accuracy by Stars</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={m.error_analysis.by_star}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis dataKey="stars" tick={{ fontSize: 10, fill: "#1A1A1A" }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "#1A1A1A" }} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="correct" radius={[4, 4, 0, 0]}>
                {m.error_analysis.by_star.map((_: any, i: number) => <Cell key={i} fill={["#C0392B", "#D97852", "#E8C547", "#8FB87A", "#6FA058"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="page-card">
          <h3 className="font-serif text-base text-ink-900 mb-3">Accuracy by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={m.error_analysis.by_category} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E9DC" />
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: "#1A1A1A" }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: "#1A1A1A" }} width={60} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
              <Bar dataKey="correct" radius={[0, 4, 4, 0]} fill="#6FA058" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="page-card mt-6">
        <h3 className="font-serif text-lg text-ink-900 mb-1">Best Hyperparameters (Optuna)</h3>
        <p className="text-xs text-ink-900/50 mb-4">Tuned over {m.architecture.optuna_trials} TPE trials on the validation set.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(m.best_params).map(([k, v]: [string, any]) => (
            <div key={k} className="bg-cream-50 rounded-xl p-3 border border-cream-200">
              <p className="text-[10px] uppercase tracking-wider text-ink-900/50 font-semibold">{k}</p>
              <p className="text-lg font-bold text-ink-900 mt-1">{typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(4)) : String(v)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
