import { create } from "zustand";

interface UiState {
  loading: Record<string, boolean>;
  setLoading: (key: string, value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  loading: {},
  setLoading: (key, value) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    })),
}));