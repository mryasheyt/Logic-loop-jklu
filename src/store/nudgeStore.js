import { create } from 'zustand'

export const useNudgeStore = create((set) => ({
    nudges: [],
    setNudges: (nudges) => set({ nudges }),
    removeNudge: (id) => set((state) => ({
        nudges: state.nudges.filter(n => n._id !== id)
    })),
    clearNudges: () => set({ nudges: [] }),
}))
