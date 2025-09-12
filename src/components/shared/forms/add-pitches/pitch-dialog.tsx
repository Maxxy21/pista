"use client";

import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePitchForm } from "@/hooks/use-pitch-form";
import { useStepNavigation } from "@/hooks/use-step-navigation";
import { PitchStepContent } from "./components/pitch-step-content";
import { DialogHeader } from "./components/dialog-header";
import { DialogFooter } from "./components/dialog-footer";
import { ProgressOverlay } from "./components/progress-overlay";

interface PitchDialogProps {
  orgId?: string;
  children?: React.ReactNode;
  className?: string;
  enableQuestions?: boolean;
}

export function PitchDialog({
  orgId,
  children,
  className,
  enableQuestions = true,
}: PitchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const stepNav = useStepNavigation();
  const form = usePitchForm(orgId, enableQuestions);

  const steps = {
    pitch: {
      title: "Upload Your Pitch",
      description: "Share your pitch as text, audio, or upload a file",
      progress: 50,
    },
    questions: {
      title: "Answer Questions",
      description: "Respond to follow-up questions to improve your evaluation",
      progress: 75,
    },
    review: {
      title: "Review and Submit",
      description: "Review your pitch before getting your evaluation",
      progress: 100,
    },
  };

  const handleContinue = async () => {
    const nextStep = await form.generateQuestions();
    stepNav.goToStep(nextStep as "questions" | "review");
  };

  const handleSubmit = async () => {
    await form.handleSubmit();
    setIsOpen(false);
  };

  // Reset form and navigation when dialog closes
  const { resetForm } = form;
  const { resetNavigation } = stepNav;
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        resetForm();
        resetNavigation();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, resetForm, resetNavigation]);

  const isContinueDisabled =
    form.isProcessing ||
    !form.pitchData.title ||
    (form.pitchData.type === "text" ? !form.pitchData.content : form.files.length === 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            className={cn(
              "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2",
              className
            )}
          >
            <Upload className="h-4 w-4" />
            New Pitch
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader
          title={steps[stepNav.currentStep].title}
          description={steps[stepNav.currentStep].description}
          progress={steps[stepNav.currentStep].progress}
        />

        <PitchStepContent
          currentStep={stepNav.currentStep}
          currentQuestionIndex={stepNav.currentQuestionIndex}
          pitchData={form.pitchData}
          setPitchData={form.setPitchData}
          files={form.files}
          setFiles={form.setFiles}
          questions={form.questions}
          setQuestions={form.setQuestions}
          isProcessing={form.isProcessing}
        />

        <DialogFooter
          currentStep={stepNav.currentStep}
          currentQuestionIndex={stepNav.currentQuestionIndex}
          questionsLength={form.questions.length}
          questions={form.questions}
          isProcessing={form.isProcessing}
          pending={form.pending}
          isContinueDisabled={isContinueDisabled}
          onBack={(step, questionIndex) => {
            if (step) stepNav.goToStep(step);
            if (questionIndex !== undefined) stepNav.setCurrentQuestionIndex(questionIndex);
          }}
          onContinue={handleContinue}
          onNextQuestion={() => {
            if (stepNav.currentQuestionIndex < form.questions.length - 1) {
              stepNav.nextQuestion();
            } else {
              stepNav.goToStep("review");
            }
          }}
          onSubmit={handleSubmit}
        />

        <ProgressOverlay
          uploadProgress={form.uploadProgress}
          isVisible={form.uploadProgress > 0 && form.uploadProgress < 100}
        />
      </DialogContent>
    </Dialog>
  );
}
