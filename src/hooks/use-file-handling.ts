import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { normalizeTranscriptText } from "@/lib/utils/text"

export type PitchType = "text" | "textFile" | "audio"

export function useFileHandling(type: PitchType) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ url?: string; text?: string } | null>(null)

  // Clear file when switching between incompatible tab types
  useEffect(() => {
    if (file) {
      const isCurrentFileCompatible = 
        (type === "audio" && file.type.startsWith("audio/")) ||
        (type === "textFile" && (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")))
      
      if (type === "text" || !isCurrentFileCompatible) {
        setFile(null)
        setPreview(null)
      }
    }
  }, [type, file])

  // Build preview for audio/text files
  useEffect(() => {
    let revokedUrl: string | undefined
    const run = async () => {
      if (!file) return setPreview(null)
      
      if (type === "audio") {
        const url = URL.createObjectURL(file)
        revokedUrl = url
        setPreview({ url })
      } else if (type === "textFile") {
        try {
          const text = await file.text()
          setPreview({ text: text.slice(0, 800) })
        } catch {
          setPreview(null)
        }
      } else {
        setPreview(null)
      }
    }
    run()
    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl)
    }
  }, [file, type])

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    if (!newFiles?.length) return
    const f = newFiles[0]
    
    if (type === "audio") {
      if (!f.type.startsWith("audio/")) {
        toast.error("Please upload an audio file (mp3, wav, m4a, ...)")
        return
      }
    } else if (type === "textFile") {
      // Prefer text/plain, fallback to .txt extension check
      const isTxt = f.type === "text/plain" || f.name.toLowerCase().endsWith(".txt")
      if (!isTxt) {
        toast.error("Please upload a plain text .txt file")
        return
      }
    }
    setFile(f)
  }, [type])

  const removeFile = useCallback(() => {
    setFile(null)
    setPreview(null)
  }, [])

  const hasValidFile = useCallback(() => {
    return !!file
  }, [file])

  const readTextFile = useCallback(async (f: File) => {
    return await f.text()
  }, [])

  return {
    file,
    preview,
    handleFilesSelected,
    removeFile,
    hasValidFile,
    readTextFile,
  }
}