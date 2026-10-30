import { NextRequest, NextResponse } from "next/server";

interface AnalyzeBody {
  text: string;
  stars: number;
  verified: boolean;
  hasImage: boolean;
  userId?: string;
  businessId?: string;
}

function vaderScore(text: string): number {
  const t = text.toLowerCase();
  let score = 0;
  const posWords = ["good", "great", "excellent", "amazing", "love", "perfect", "best", "fantastic", "wonderful", "happy", "recommend"];
  const negWords = ["bad", "terrible", "awful", "worst", "hate", "horrible", "scam", "fake", "broken", "damaged", "disappointing", "waste"];
  posWords.forEach((w) => { if (t.includes(w)) score += 0.15; });
  negWords.forEach((w) => { if (t.includes(w)) score -= 0.15; });
  const exclamations = (t.match(/!/g) || []).length;
  if (exclamations > 3) score -= 0.1 * Math.min(exclamations / 3, 3);
  const capsRatio = (t.match(/[A-Z]/g) || []).length / Math.max(t.length, 1);
  if (capsRatio > 0.3) score -= 0.15;
  return Math.max(-1, Math.min(1, score));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AnalyzeBody;
  const text = body.text || "";
  const stars = body.stars || 3;

  const vader = vaderScore(text);
  const textLen = text.length;
  const hasExcessiveExclamations = (text.match(/!/g) || []).length > 5;
  const hasExcessiveCaps = (text.match(/[A-Z]{4,}/g) || []).length > 2;
  const isExtremeRating = stars === 1 || stars === 5;
  const isShort = textLen < 80;
  const hasRepeatedPhrases = /(.{10,})\1{1,}/i.test(text);

  let suspectScore = 0;
  if (isExtremeRating) suspectScore += 1;
  if (!body.verified) suspectScore += 1;
  if (isShort) suspectScore += 1;
  if (hasExcessiveExclamations) suspectScore += 2;
  if (hasExcessiveCaps) suspectScore += 2;
  if (hasRepeatedPhrases) suspectScore += 2;
  if (vader < -0.3 && stars === 5) suspectScore += 2;
  if (vader > 0.3 && stars === 1) suspectScore += 2;

  const proba = Math.min(0.99, Math.max(0.01, suspectScore / 9));
  const band = proba >= 0.6 ? "Strong" : proba >= 0.3 ? "Moderate" : "Weak";
  const verdict = proba >= 0.5 ? "Suspicious review" : "Routine complaint";

  const components = [
    { name: "VADER compound", value: Math.abs(vader), description: "Sentiment polarity magnitude" },
    { name: "Rating extremity", value: isExtremeRating ? 1 : 0, description: "1 or 5 star review" },
    { name: "Exclamation density", value: hasExcessiveExclamations ? 1 : 0, description: "Excessive exclamation marks" },
    { name: "Caps ratio", value: hasExcessiveCaps ? 1 : 0, description: "Excessive capital letters" },
    { name: "Text length", value: Math.min(textLen / 200, 1), description: "Review character count" },
    { name: "Verification", value: body.verified ? 0 : 1, description: "Unverified purchase" },
    { name: "Repeated phrases", value: hasRepeatedPhrases ? 1 : 0, description: "Duplicated text segments" },
    { name: "Sentiment-rating mismatch", value: vader < -0.3 && stars === 5 ? 1 : vader > 0.3 && stars === 1 ? 1 : 0, description: "Rating contradicts text sentiment" },
  ].sort((a, b) => b.value - a.value);

  const reasons: string[] = [];
  if (hasExcessiveExclamations) reasons.push("Exclamation marks appear more than 5 times, a common pattern in incentivised or fabricated reviews.");
  if (hasExcessiveCaps) reasons.push("Extended capital-letter runs suggest emphasis typical of promotional rather than organic content.");
  if (!body.verified) reasons.push("The purchase is not marked as verified, weakening the provenance of the complaint.");
  if (isShort) reasons.push("Review length is under 80 characters, which is unusually terse for a genuine experience report.");
  if (vader < -0.3 && stars === 5) reasons.push("Sentiment polarity is strongly negative while the star rating is 5, an inconsistency flagged in the deceptive-opinion literature.");
  if (vader > 0.3 && stars === 1) reasons.push("Sentiment polarity is positive while the star rating is 1, an inconsistency that warrants manual review.");
  if (hasRepeatedPhrases) reasons.push("Phrases repeat inside the review, a hallmark of templated content.");
  if (reasons.length === 0) reasons.push("No individual signal exceeds the suspicion threshold; the review pattern is ordinary for this corpus.");

  return NextResponse.json({
    score: proba,
    band,
    confidence: proba,
    verdict,
    components,
    reasons,
  });
}
