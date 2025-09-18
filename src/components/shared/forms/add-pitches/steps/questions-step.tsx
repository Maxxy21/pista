"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  text: string;
  answer: string;
}

interface QuestionsStepProps {
  questions: Question[];
  currentIndex: number;
  onAnswerChange: (index: number, value: string) => void;
}

export function QuestionsStep({ questions, currentIndex, onAnswerChange }: QuestionsStepProps) {
  if (!questions.length) return null;
  return (
    <motion.div
      key="questions-step"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <h3 className="font-medium">Question {currentIndex + 1} of {questions.length}</h3>
              <p className="text-xs text-muted-foreground">These questions help improve your evaluation accuracy</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i === currentIndex ? "bg-primary" : i < currentIndex ? "bg-primary/40" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-base font-medium">{questions[currentIndex].text}</p>
              <Textarea
                placeholder="Type your answer here..."
                value={questions[currentIndex].answer}
                onChange={(e) => onAnswerChange(currentIndex, e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

