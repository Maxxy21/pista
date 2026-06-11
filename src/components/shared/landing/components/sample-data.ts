export interface SampleCriterion {
  criteria: string;
  score: number;
  summary: string;
  strength: string;
  improvement: string;
}

export interface SampleEvaluation {
  overallScore: number;
  verdict: string;
  evaluatedInSeconds: number;
  categories: SampleCriterion[];
}

export const sampleEvaluation: SampleEvaluation = {
  overallScore: 8.4,
  verdict: "Strong pitch. Ready to present to investors.",
  evaluatedInSeconds: 47,
  categories: [
    {
      criteria: "Problem-Solution Fit",
      score: 8.4,
      summary:
        "A sharply defined problem with a solution that maps directly to it and clear early demand.",
      strength: "Quantified pain point backed by customer interviews.",
      improvement: "Name the wedge use case you win first.",
    },
    {
      criteria: "Business Model",
      score: 6.2,
      summary:
        "Pricing is credible but unit economics and expansion path need more proof.",
      strength: "Recurring revenue with a logical pricing tier.",
      improvement: "Show CAC payback and a path to net revenue retention.",
    },
    {
      criteria: "Team & Execution",
      score: 4.8,
      summary:
        "Strong product instincts, but the team has a visible gap on go-to-market.",
      strength: "Technical founder who has shipped the core product.",
      improvement: "Add or name a commercial/GTM lead to de-risk execution.",
    },
    {
      criteria: "Pitch Quality",
      score: 7.1,
      summary:
        "Clear narrative arc; a few slides bury the strongest proof points.",
      strength: "Tight, jargon-free storytelling.",
      improvement: "Lead with traction instead of saving it for the end.",
    },
  ],
};
