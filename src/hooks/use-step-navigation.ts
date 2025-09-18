"use client";

import { useState, useCallback } from "react";

type Step = "pitch" | "questions" | "review";

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState<Step>("pitch");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const goToStep = useCallback((step: Step) => setCurrentStep(step), []);
  
  const nextQuestion = useCallback(() => setCurrentQuestionIndex(prev => prev + 1), []);
  
  const previousQuestion = useCallback(() => setCurrentQuestionIndex(prev => prev - 1), []);
  
  const setQuestionIndex = useCallback((index: number) => setCurrentQuestionIndex(index), []);
  
  const resetNavigation = useCallback(() => {
    setCurrentStep("pitch");
    setCurrentQuestionIndex(0);
  }, []);

  return {
    currentStep,
    currentQuestionIndex,
    setCurrentQuestionIndex: setQuestionIndex,
    goToStep,
    nextQuestion,
    previousQuestion,
    resetNavigation,
  };
}
