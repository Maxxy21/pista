type PitchLike = {
  _id: string | number;
  title?: string;
  type?: string;
  authorName?: string;
  createdAt?: number | string;
  _creationTime?: number;
  evaluation?: {
    overallScore?: number;
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
    ];
    rows.push(headers.join(","));

    for (const p of pitches) {
      const id = String(p._id);
      const title = JSON.stringify(p.title ?? "");
      const type = JSON.stringify((p as any).type ?? "");
      const author = JSON.stringify(p.authorName ?? "");
      const createdAtSrc = (p as any).createdAt ?? p._creationTime;
      const createdAt = createdAtSrc ? new Date(createdAtSrc as any).toLocaleDateString() : "";

      const ev = p.evaluation || {};
      const overallScore = String(ev.overallScore ?? "");

      rows.push(
        [
          id,
          title,
          type,
          author,
          createdAt,
          overallScore,
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
