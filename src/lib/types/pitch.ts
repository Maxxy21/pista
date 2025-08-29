// lib/types/pitch.ts

import { Id } from "@/convex/_generated/dataModel";
import { UniversalEvaluationData } from "@/lib/utils/evaluation-utils";

export interface UniversalPitchData {
  _id: Id<"pitches">;
  title: string;
  text: string;
  type: string;
  status: string;
  evaluation: UniversalEvaluationData;
  questions: Array<{
    text: string;
    answer: string;
  }>;
  orgId: string;
  userId: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  _creationTime: number;
  isFavorite?: boolean;
}