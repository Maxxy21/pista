import { toast } from "sonner";

type PitchLike = {
  _id: string | number;
  title?: string;
  type?: string;
  authorName?: string;
  createdAt?: number | string;
  _creationTime?: number;
  evaluation?: {
    overallScore?: number;
    metadata?: {
      evaluatedAt?: string;
      modelVersion?: string;
      promptVersion?: string;
      policyVersion?: string;
    };
  };
};

export function exportPitchesCsv(pitches: PitchLike[]) {
  try {
    const rows: string[] = [];
    const headers = [
      "id",
      "title",
      "type",
      "author",
      "createdAt",
      "overallScore",
      "evaluatedAt",
      "modelVersion",
      "promptVersion",
      "policyVersion",
    ];
    rows.push(headers.join(","));

    for (const p of pitches) {
      const id = String(p._id);
      const title = JSON.stringify(p.title ?? "");
      const type = JSON.stringify((p as any).type ?? "");
      const author = JSON.stringify(p.authorName ?? "");
      const createdAtSrc = (p as any).createdAt ?? p._creationTime;
      const createdAt = createdAtSrc ? new Date(createdAtSrc as any).toISOString() : "";

      const ev = p.evaluation || {};
      const overallScore = String(ev.overallScore ?? "");
      const meta = ev.metadata || {};
      const evaluatedAt = (meta as any).evaluatedAt ?? "";
      const modelVersion = JSON.stringify((meta as any).modelVersion ?? "");
      const promptVersion = JSON.stringify((meta as any).promptVersion ?? "");
      const policyVersion = JSON.stringify((meta as any).policyVersion ?? "");

      rows.push(
        [
          id,
          title,
          type,
          author,
          createdAt,
          overallScore,
          evaluatedAt,
          modelVersion,
          promptVersion,
          policyVersion,
        ].join(",")
      );
    }

    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pitches-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { data: { rows: Math.max(rows.length - 1, 0) }, error: null as null };
  } catch (e: any) {
    return { data: null, error: e as Error };
  }
}

export function downloadCsvFromRows(rows: string[][], filename: string) {
  try {
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { data: { rows: Math.max(rows.length - 1, 0) }, error: null as null };
  } catch (e: any) {
    return { data: null, error: e as Error };
  }
}
