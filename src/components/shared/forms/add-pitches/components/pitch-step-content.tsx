"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PitchInputStep } from "../steps/pitch-input-step";
import { QuestionsStep } from "../steps/questions-step";
import { ReviewStep } from "../steps/review-step";

interface PitchData {
  title: string;
  type: "text" | "audio" | "textFile";
  content: string;
}

interface PitchStepContentProps {
  currentStep: "pitch" | "questions" | "review";
  currentQuestionIndex: number;
  pitchData: PitchData;
  setPitchData: (data: PitchData | ((prev: PitchData) => PitchData)) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  questions: Array<{ text: string; answer: string }>;
  setQuestions: (questions: Array<{ text: string; answer: string }> | ((prev: Array<{ text: string; answer: string }>) => Array<{ text: string; answer: string }>)) => void;
  isProcessing: boolean;
}

export function PitchStepContent({
  currentStep,
  currentQuestionIndex,
  pitchData,
  setPitchData,
  files,
  setFiles,
  questions,
  setQuestions,
  isProcessing,
}: PitchStepContentProps) {
  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <AnimatePresence mode="wait">
        {currentStep === "pitch" && (
          <motion.div
            key="pitch-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PitchInputStep
              pitchData={pitchData}
              setPitchData={setPitchData}
              files={files}
              setFiles={setFiles}
              isProcessing={isProcessing}
            />
          </motion.div>
        )}

        {currentStep === "questions" && (
          <motion.div
            key="questions-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionsStep
              questions={questions}
              currentIndex={currentQuestionIndex}
              onAnswerChange={(index, value) => {
                setQuestions(prev => {
                  const updated = [...prev];
                  updated[index].answer = value;
                  return updated;
                });
              }}
            />
          </motion.div>
        )}

        {currentStep === "review" && (
          <motion.div
            key="review-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ReviewStep
              pitchData={pitchData}
              files={files}
              questions={questions}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}