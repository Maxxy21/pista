import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone, type Accept } from "react-dropzone";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  accept,
  multiple = false,
  hint,
  showList = true,
  maxSize,
}: {
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
  showList?: boolean;
  maxSize?: number; // in bytes
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    if (multiple) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } else {
      setFiles(newFiles.slice(0, 1));
    }
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const toDropzoneAccept = (s?: string): Accept | undefined => {
    if (!s) return undefined;
    const lower = s.toLowerCase();
    const map: Accept = {};
    if (lower.includes("audio/")) {
      map["audio/*"] = [];
    }
    if (lower.includes("text/plain") || lower.includes(".txt")) {
      map["text/plain"] = [".txt"];
    }
    return Object.keys(map).length ? map : undefined;
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    noClick: true,
    accept: toDropzoneAccept(accept),
    maxSize,
    onDrop: handleFileChange,
    onDropRejected: (rejections) => {
      try {
        const first = rejections?.[0];
        const reason = first?.errors?.[0]?.message || "File not accepted";
        if (reason.toLowerCase().includes("too large") && maxSize) {
          const mb = (maxSize / (1024 * 1024)).toFixed(0);
          toast.error(`File too large. Max ${mb} MB allowed.`);
        } else {
          toast.error(reason);
        }
      } catch (e) {
        console.log(rejections);
      }
    },
  });

  const computedHint = React.useMemo(() => {
    if (hint) return hint;
    if (!accept) return undefined;
    const max = maxSize ? ` • Max ${(maxSize / (1024 * 1024)).toFixed(0)} MB` : "";
    if (accept.includes("audio/*")) return `Accepted: audio/* (e.g., mp3, wav, m4a)${max}`;
    if (accept.includes("text/plain") || accept.includes(".txt")) return `Accepted: .txt (plain text)${max}`;
    return `Accepted: ${accept}${max}`;
  }, [hint, accept, maxSize]);

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            if (!selected.length) return;
            if (typeof maxSize === "number") {
              const allowed = selected.filter((f) => f.size <= maxSize);
              const rejected = selected.filter((f) => f.size > maxSize);
              if (rejected.length) {
                const mb = (maxSize / (1024 * 1024)).toFixed(0);
                toast.error(`Some files exceed the ${mb} MB limit`);
              }
              if (allowed.length) handleFileChange(allowed);
            } else {
              handleFileChange(selected);
            }
          }}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {showList && files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
          {computedHint && (
            <p className="relative z-20 text-xs text-neutral-500 dark:text-neutral-400 mt-3 text-center">
              {computedHint}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
