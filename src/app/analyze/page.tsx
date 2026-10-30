"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Search, Sparkles, Loader2, Download } from "lucide-react";

interface AnalysisResult {
  score: number;
  band: string;
  confidence: number;
  verdict: string;
  components: { name: string; value: number; description: string }[];
  reasons: string[];
}

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [verified, setVerified] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [userId, setUserId] = useState("");
  const [bizId, setBizId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!text.trim()) {
      setError("Please enter review text to analyse.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, stars, verified, hasImage, userId, businessId: bizId }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to analyse review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setText("BEST PRODUCT EVER!!! Absolutely amazing!!! Must buy!!! Five stars!!! Incredible value for money!!!");
    setStars(5);
    setVerified(false);
    setHasImage(false);
    setUserId("u_demo_001");
    setBizId("b_demo_042");
  }

  return (
    <div>
      <PageHeader
        title="Review Analysis"
        subtitle="Score a single consumer review against the Trust Chain model in real time."
        badge="Live"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="page-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-ink-900">Review Input</h3>
            <button onClick={loadSample} className="btn-secondary text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Load sample
            </button>
          </div>

          <label className="block text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-1.5">Review text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste a consumer review here..."
            className="input-field resize-none mb-4"
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-1.5">Stars</label>
              <select value={stars} onChange={(e) => setStars(Number(e.target.value))} className="input-field">
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>{s} star{s > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-1.5">User ID</label>
              <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="u_000123" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-ink-900/60 uppercase tracking-wider mb-1.5">Business ID</label>
              <input value={bizId} onChange={(e) => setBizId(e.target.value)} placeholder="b_000042" className="input-field" />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-900/70 cursor-pointer">
                <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="w-4 h-4 rounded accent-ink-900" />
                Verified
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-900/70 cursor-pointer">
                <input type="checkbox" checked={hasImage} onChange={(e) => setHasImage(e.target.checked)} className="w-4 h-4 rounded accent-ink-900" />
                Has image
              </label>
            </div>
          </div>

          {error && <p className="text-terracotta-500 text-sm mb-3">{error}</p>}

          <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Analysing..." : "Analyse review"}
          </button>
        </div>

        <div className="page-card">
          <h3 className="font-serif text-lg text-ink-900 mb-4">Analysis Result</h3>
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mb-3">
                <Search className="w-7 h-7 text-cream-400" />
              </div>
              <p className="text-sm text-ink-900/40">Submit a review to see the verdict, likelihood band, confidence and per-component breakdown.</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Verdict</p>
                  <p className="font-serif text-xl text-ink-900 mt-0.5">{result.verdict}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Confidence</p>
                  <p className="text-2xl font-bold text-terracotta-500">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold">Likelihood band</span>
                  <span className={`pill ${result.band === "Strong" ? "pill-strong" : result.band === "Moderate" ? "pill-moderate" : "pill-routine"}`}>
                    {result.band}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-cream-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${result.score * 100}%`, background: result.band === "Strong" ? "#C0392B" : result.band === "Moderate" ? "#E8C547" : "#6FA058" }}
                    />
                  </div>
                  <span className="text-sm font-bold text-ink-900">{result.score.toFixed(3)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold mb-2">Top contributing components</p>
                <div className="space-y-1.5">
                  {result.components.slice(0, 6).map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-sm py-1.5 px-3 bg-cream-50 rounded-lg">
                      <div>
                        <span className="font-medium text-ink-900">{c.name}</span>
                        <p className="text-[11px] text-ink-900/40">{c.description}</p>
                      </div>
                      <span className="text-terracotta-500 font-semibold">{c.value.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ink-900/50 font-semibold mb-2">Plain-language reasons</p>
                <ul className="space-y-1.5">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-ink-900/70 flex items-start gap-2">
                      <span className="text-terracotta-400 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "trust_chain_case_report.json";
                  a.click();
                }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export case report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
