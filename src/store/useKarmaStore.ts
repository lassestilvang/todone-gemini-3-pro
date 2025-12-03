import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSameDay, isYesterday, parseISO } from 'date-fns';

interface KarmaState {
    points: number;
    level: string;
    dailyGoal: number;
    dailyProgress: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
    history: { date: string; points: number }[];

    addPoints: (amount: number) => void;
    updateDailyProgress: () => void;
    checkStreak: () => void;
}

const LEVELS = [
    { name: 'Beginner', min: 0 },
    { name: 'Novice', min: 500 },
    { name: 'Intermediate', min: 2500 },
    { name: 'Advanced', min: 5000 },
    { name: 'Expert', min: 10000 },
    { name: 'Master', min: 20000 },
    { name: 'Grandmaster', min: 50000 },
];

export const useKarmaStore = create<KarmaState>()(
    persist(
        (set, get) => ({
            points: 0,
            level: 'Beginner',
            dailyGoal: 5,
            dailyProgress: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            history: [],

            addPoints: (amount) => {
                set((state) => {
                    const newPoints = state.points + amount;
                    const newLevel = LEVELS.slice().reverse().find(l => newPoints >= l.min)?.name || state.level;

                    // Update history
                    const today = new Date().toISOString().split('T')[0];
                    const historyIndex = state.history.findIndex(h => h.date === today);
                    let newHistory = [...state.history];

                    if (historyIndex >= 0) {
                        newHistory[historyIndex].points += amount;
                    } else {
                        newHistory.push({ date: today, points: amount });
                    }

                    return {
                        points: newPoints,
                        level: newLevel,
                        history: newHistory,
                    };
                });
                get().updateDailyProgress();
                get().checkStreak();
            },

            updateDailyProgress: () => {
                set((state) => {
                    // In a real app, we'd count completed tasks for today from the task store
                    // For now, we'll just increment based on addPoints calls (assuming 1 task = X points)
                    // This is a simplification. Ideally, we should listen to task completions.
                    // Let's assume addPoints is called with a standard amount for task completion.
                    return { dailyProgress: state.dailyProgress + 1 };
                });
            },

            checkStreak: () => {
                set((state) => {
                    const today = new Date();
                    const lastActive = state.lastActivityDate ? parseISO(state.lastActivityDate) : null;

                    let newStreak = state.currentStreak;

                    if (!lastActive) {
                        newStreak = 1;
                    } else if (isYesterday(lastActive)) {
                        // Continued streak
                        // Only increment if not already incremented today? 
                        // Actually, streak usually counts days. 
                        // If last active was yesterday, and we are active today, streak increases.
                        // But we only want to increase it once per day.
                        if (!isSameDay(lastActive, today)) {
                            newStreak += 1;
                        }
                    } else if (isSameDay(lastActive, today)) {
                        // Already active today, keep streak
                    } else {
                        // Streak broken
                        newStreak = 1;
                    }

                    return {
                        currentStreak: newStreak,
                        longestStreak: Math.max(newStreak, state.longestStreak),
                        lastActivityDate: today.toISOString(),
                    };
                });
            },
        }),
        {
            name: 'todone-karma-storage',
        }
    )
);
