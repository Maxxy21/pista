export function normalizeTranscriptText(input: string): string {
  if (!input) return "";
  // Normalize newlines, collapse hard wraps inside paragraphs, preserve paragraph breaks
  const lf = input.replace(/\r\n?/g, "\n");
  const paragraphs = lf
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paragraphs.join("\n\n");
}

export function splitParagraphs(input: string): string[] {
  const lf = input.replace(/\r\n?/g, "\n");
  return lf.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

