"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type Preview = { url?: string; text?: string };

export default function FileUploadExample() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<string, Preview>>({});
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [maxMB, setMaxMB] = useState<number>(5);

  const keyFor = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

  useEffect(() => {
    let cancelled = false;
    const urlsToRevoke: string[] = [];

    const run = async () => {
      const next: Record<string, Preview> = {};
      for (const f of files) {
        const key = keyFor(f);
        if (f.type.startsWith("audio/")) {
          const url = URL.createObjectURL(f);
          urlsToRevoke.push(url);
          next[key] = { url };
        } else if (f.type === "text/plain" || f.name.toLowerCase().endsWith(".txt")) {
          try {
            const t = await f.text();
            next[key] = { text: t.slice(0, 500) };
          } catch {}
        }
      }
      if (!cancelled) setPreviews(next);
    };

    run();
    return () => {
      cancelled = true;
      urlsToRevoke.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log(newFiles);
  };

  const accept = useMemo(
    () => (mode === "audio" ? "audio/*" : "text/plain,.txt"),
    [mode]
  );
  const maxSize = useMemo(() => Math.max(1, maxMB) * 1024 * 1024, [maxMB]);

  // Clear previews when mode changes (to avoid misleading previews)
  useEffect(() => {
    setFiles([]);
    setPreviews({});
  }, [mode]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList>
            <TabsTrigger value="text">Text (.txt)</TabsTrigger>
            <TabsTrigger value="audio">Audio (audio/*)</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Label htmlFor="max-size" className="text-sm text-muted-foreground">Max size</Label>
          <select
            id="max-size"
            className="h-8 rounded-md border bg-background px-2 text-sm"
            value={maxMB}
            onChange={(e) => setMaxMB(Number(e.target.value))}
          >
            <option value={1}>1 MB</option>
            <option value={5}>5 MB</option>
            <option value={10}>10 MB</option>
            <option value={25}>25 MB</option>
            <option value={50}>50 MB</option>
          </select>
        </div>
      </div>

      <div className="min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} showList={false} accept={accept} maxSize={maxSize} />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((f) => {
            const key = keyFor(f);
            const p = previews[key];
            return (
              <div
                key={key}
                className="rounded-md border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(f.size / (1024 * 1024)).toFixed(2)} MB • {f.type || "unknown"}
                    </p>
                  </div>
                </div>
                {p?.url && (
                  <div className="mt-2">
                    <audio src={p.url} controls className="w-full" />
                  </div>
                )}
                {p?.text && (
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-background p-2 text-xs text-foreground/80 border">
                    {p.text}
                    {f.size > 500 && "\n..."}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
