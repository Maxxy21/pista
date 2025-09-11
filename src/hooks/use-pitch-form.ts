"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface PitchData {
  title: string;
  type: "text" | "audio" | "textFile";
  content: string;
}

const initialPitchData: PitchData = {
  title: "",
  type: "text",
  content: "",
};

export function usePitchForm(orgId?: string, enableQuestions = false) {
  const router = useRouter();
  const [pitchData, setPitchData] = useState<PitchData>(initialPitchData);
  const [questions, setQuestions] = useState<Array<{ text: string; answer: string }>>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pitchText, setPitchText] = useState("");

  const { mutate: createPitch, pending } = useApiMutation(api.pitches.create);

  const processContent = useCallback(async () => {
    const { type, content } = pitchData;
    let text = "";

    if (type === "text") {
      text = content || "";
    } else if (files.length > 0) {
      if (type === "audio") {
        const formData = new FormData();
        formData.append("audio", files[0]);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setUploadProgress((prev) => Math.min(progress, 90));
          if (progress >= 90) clearInterval(interval);
        }, 200);

        try {
          const transcriptionResponse = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          clearInterval(interval);
          setUploadProgress(100);

          if (!transcriptionResponse.ok) {
            throw new Error("Transcription failed");
          }

          const transcriptionData = await transcriptionResponse.json();
          text = transcriptionData.text;
        } catch (error) {
          clearInterval(interval);
          throw error;
        }
      } else if (type === "textFile") {
        text = await files[0].text();
      }
    }

    return text;
  }, [pitchData, files]);

  const generateQuestions = useCallback(async () => {
    setIsProcessing(true);
    try {
      const text = await processContent();
      setPitchText(text);

      if (enableQuestions) {
        try {
          const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });

          if (!response.ok) throw new Error("Failed to generate questions");
          const data = await response.json();

          const qs = Array.isArray(data?.questions) ? data.questions : [];
          if (qs.length > 0) {
            setQuestions(qs.map((q: string) => ({ text: q, answer: "" })));
            return "questions";
          } else {
            setQuestions([]);
            return "review";
          }
        } catch (e) {
          setQuestions([]);
          return "review";
        }
      } else {
        setQuestions([]);
        return "review";
      }
    } catch (error) {
      toast.error("Failed to process pitch");
      throw error;
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [processContent, enableQuestions]);

  const handleSubmit = useCallback(async () => {
    setIsProcessing(true);
    try {
      const evaluationResponse = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: pitchText,
          questions,
        }),
      });

      if (!evaluationResponse.ok) throw new Error("Evaluation failed");
      const evaluationData = await evaluationResponse.json();

      const id = await createPitch({
        orgId: orgId ?? "",
        title: pitchData.title,
        text: pitchText,
        type: pitchData.type,
        status: "evaluated",
        evaluation: evaluationData,
        questions,
      });

      toast.success("Pitch created successfully");
      router.push(`/pitch/${id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create pitch");
      throw error;
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [pitchData, pitchText, questions, createPitch, orgId, router]);

  const resetForm = useCallback(() => {
    setPitchData(initialPitchData);
    setFiles([]);
    setQuestions([]);
    setPitchText("");
  }, []);

  return {
    pitchData,
    setPitchData,
    questions,
    setQuestions,
    files,
    setFiles,
    isProcessing,
    uploadProgress,
    pending,
    generateQuestions,
    handleSubmit,
    resetForm,
  };
}