import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  completedLessons: Set<string>;
  addCompletedLesson: (lessonId: string) => void;
  removeCompletedLesson: (lessonId: string) => void;
  setCompletedLessons: (lessonIds: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  completedLessons: new Set(),
  addCompletedLesson: (lessonId) => set((state) => ({ completedLessons: new Set(state.completedLessons).add(lessonId) })),
  removeCompletedLesson: (lessonId) => set((state) => {
    const newSet = new Set(state.completedLessons);
    newSet.delete(lessonId);
    return { completedLessons: newSet };
  }),
  setCompletedLessons: (lessonIds) => set({ completedLessons: new Set(lessonIds) }),
}));
