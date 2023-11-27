import { create } from 'zustand';

interface EditorStore {
  markdownValue: string;
  isPreviewPanelOpen: boolean;
  updateMarkdownValue: (markdown: string) => void;
  togglePreviewPanel: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  markdownValue: '',
  isPreviewPanelOpen: true,
  updateMarkdownValue: (markdown) => set({ markdownValue: markdown }),
  togglePreviewPanel: () =>
    set((state) => ({ isPreviewPanelOpen: !state.isPreviewPanelOpen })),
}));
