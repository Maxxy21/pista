"use client";

import { useState } from "react";

type Step = "pitch" | "questions" | "review";

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState<Step>("pitch");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const goToStep = (step: Step) => setCurrentStep(step);
  
  const nextQuestion = () => setCurrentQuestionIndex(prev => prev + 1);
  
  const previousQuestion = () => setCurrentQuestionIndex(prev => prev - 1);
  
  const setQuestionIndex = (index: number) => setCurrentQuestionIndex(index);
  
  const resetNavigation = () => {
    setCurrentStep("pitch");
    setCurrentQuestionIndex(0);
  };

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