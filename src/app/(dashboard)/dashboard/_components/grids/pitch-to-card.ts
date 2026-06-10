import type { Pitch } from "./pitches-grid";
import type { PitchCardProps } from "../cards/pitch-card";
import { normalizeTranscriptText } from "@/lib/utils/text";

function inputTypeLabel(type: string): "TEXT" | "AUDIO" {
  return type === "audio" ? "AUDIO" : "TEXT";
}

export function toPitchCardProps(
  pitch: Pitch,
  onClick: (id: string) => void
): PitchCardProps {
  return {
    id: pitch._id,
    title: pitch.title,
    text: normalizeTranscriptText(pitch.text),
    authorId: pitch.userId,
    authorName: pitch.authorName,
    createdAt: pitch._creationTime,
    orgId: pitch.orgId,
    isFavorite: pitch.isFavorite,
    score: pitch.evaluation.overallScore,
    inputType: inputTypeLabel(pitch.type),
    onClick: () => onClick(pitch._id),
  };
}
