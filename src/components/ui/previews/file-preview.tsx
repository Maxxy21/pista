"use client";

import { motion } from "framer-motion";

interface FilePreviewProps {
  file: File;
}

export const FilePreview = ({ file }: FilePreviewProps) => {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const lastModified = new Date(file.lastModified).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      className="mt-1 p-2 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="region"
      aria-label={`Preview of file ${file.name}`}
    >
      <div className="flex justify-between w-full items-center gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="text-sm text-foreground truncate max-w-xs"
          title={file.name}
        >
          {file.name}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="rounded px-1.5 py-0.5 w-fit flex-shrink-0 text-xs text-muted-foreground border"
        >
          {fileSizeMB} MB
        </motion.p>
      </div>
      <div className="flex text-xs md:flex-row flex-col items-start md:items-center w-full mt-1 justify-between text-muted-foreground">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="px-1 py-0.5 rounded-md bg-muted"
        >
          {file.type || "Unknown type"}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
          Modified {lastModified}
        </motion.p>
      </div>
    </motion.div>
  );
};

