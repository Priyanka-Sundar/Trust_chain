export interface DashboardData {
  project: string;
  subtitle: string;
  corpus_size: number;
  unique_users: number;
  unique_businesses: number;
  positive_rate: number;
  rating_distribution: { stars: number; count: number }[];
  yearly_volume: { year: string; count: number }[];
  verdict_mix: { verdict: string; cases: number; share: number }[];
  priority_tiers: { tier: string; score_range: string; cases: number }[];
  model_summary: {
    feature_fusion: {
      metrics: Record<string, number>;
      pr_auc_ci: [number, number];
      roc_auc_ci: [number, number];
    };
    graph_sage: {
      metrics: Record<string, number>;
      pr_auc_ci: [number, number];
      roc_auc_ci: [number, number];
    };
    wilcoxon_p: number | null;
  };
  roc_curves: {
    feature_fusion: { fpr: number[]; tpr: number[] };
    graph_sage: { fpr: number[]; tpr: number[] };
  };
  pr_curves: {
    feature_fusion: { precision: number[]; recall: number[] };
    graph_sage: { precision: number[]; recall: number[] };
  };
  confusion_matrices: {
    feature_fusion: number[][];
    graph_sage: number[][];
  };
  calibration: { prob_true: number[]; prob_pred: number[] };
  fold_metrics: FoldMetric[];
  runtime_seconds: Record<string, number>;
}

export interface FoldMetric {
  fold: number;
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  mcc: number;
}

export interface Case {
  case_id: string;
  user_id: string;
  business_id: string;
  stars: number;
  date: string;
  text: string;
  vader_compound: number;
  user_deg: number;
  biz_deg: number;
  suspect_score: number;
  model_proba: number;
  true_label: number;
  pred_label: number;
  text_len: number;
}

export interface SignalsData {
  components: { name: string; group: string; dim: number; firing_rate: number; weight?: number; description: string }[];
  feature_groups: { group: string; dimensions: number; description?: string }[];
  verdict_cascade: { order: number; branch: string; rule: string }[];
  priority_bands: { tier: string; score_range: string; description: string }[];
  likelihood_bands: { band: string; range: string; description: string }[];
  pseudo_label_validation: { precision: number; recall: number; f1: number; sample_size: number };
}

export interface ModelInsights {
  top_features: { feature: string; mean_abs_shap: number }[];
  fold_summary: Record<string, number | string>[] | any[];
  test_summary: Record<string, number | string>[] | any[];
  best_params: Record<string, number>;
  feature_groups: { group: string; dimensions: number }[];
  training_history: {
    feature_fusion: { iteration: number; aucpr: number }[];
    graph_sage: { epoch: number; val_pr_auc: number }[];
  };
  architecture: Record<string, string | number>;
  error_analysis: {
    by_length: { len_bucket: string; correct: number }[];
    by_star: { stars: number; correct: number }[];
    by_category: { category: string; correct: number }[];
  };
}

export interface NetworkData {
  nodes: { id: string; type: string; degree: number; pseudo_rate: number }[];
  edges: { source: string; target: string; weight: number; stars: number }[];
}

export interface ScoringRules {
  text_preprocessing: string;
  encoder: string;
  encoder_dim: number;
  sentiment_features: string[];
  graph_features: { user_dim: number; business_dim: number; walk_length: number; num_walks: number };
  decision_threshold: number;
  best_balancing_strategy: string;
  best_params: Record<string, number>;
  sample_reviews_for_demo: { text: string; stars: number; pseudo_label: number }[];
}

export interface MethodologyData {
  pipeline_stages: { stage: number; name: string; description: string }[];
  limitations: string[];
  reproducibility: { seed: number; data_source: string; python_version: string; key_versions: Record<string, string> };
}
