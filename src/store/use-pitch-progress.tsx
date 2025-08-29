
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PitchProgress {
    title: string;
    type: string;
    content: string;
    questions: Array<{ text: string; answer: string; }>;
}

interface PitchProgressStore {
    drafts: Record<string, PitchProgress>;
    currentDraftId: string | null;
    saveDraft: (orgId: string, data: Partial<PitchProgress>) => void;
    loadDraft: (orgId: string) => PitchProgress | null;
    deleteDraft: (orgId: string) => void;
    setCurrentDraft: (orgId: string) => void;
}

export const usePitchProgress = create<PitchProgressStore>()(
    persist(
        (set, get) => ({
            drafts: {},
            currentDraftId: null,
            saveDraft: (orgId, data) => {
                set((state) => ({
                    drafts: {
                        ...state.drafts,
                        [orgId]: {
                            ...state.drafts[orgId],
                            ...data,
                        },
                    },
                }));
            },
            loadDraft: (orgId) => {
                const state = get();
                return state.drafts[orgId] || null;
            },
            deleteDraft: (orgId) => {
                set((state) => {
                    const { [orgId]: _, ...drafts } = state.drafts;
                    return { drafts };
                });
            },
            setCurrentDraft: (orgId) => {
                set({ currentDraftId: orgId });
            },
        }),
        {
            name: "pitch-progress",
        }
    )
);