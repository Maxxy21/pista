export type ViewMode = "grid" | "list";

export function getColumnCount(viewMode: ViewMode, width: number) {
  if (viewMode === "list") return 1;
  if (width < 768) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  return 4;
}

export function gridColsClass(viewMode: ViewMode, columnCount: number) {
  if (viewMode === "list") return "grid-cols-1";
  if (columnCount === 1) return "grid-cols-1";
  if (columnCount === 2) return "grid-cols-2";
  if (columnCount === 3) return "grid-cols-3";
  return "grid-cols-4";
}

