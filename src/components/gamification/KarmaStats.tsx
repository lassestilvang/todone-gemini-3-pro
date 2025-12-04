import { Trophy, Flame, Target } from 'lucide-react';
import { useKarmaStore } from '../../store/useKarmaStore';

export const KarmaStats = () => {
    const { points, level, currentStreak, dailyProgress, dailyGoal } = useKarmaStore();

    const progressPercentage = Math.min(100, (dailyProgress / dailyGoal) * 100);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{level}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{points} Karma Points</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <Trophy size={20} />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Target size={12} />
                            Daily Goal
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{dailyProgress}/{dailyGoal}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800/30">
                    <Flame size={16} className="text-orange-500 dark:text-orange-400" />
                    <div>
                        <div className="text-xs font-bold text-orange-700 dark:text-orange-300">{currentStreak} Day Streak</div>
                        <div className="text-[10px] text-orange-600 dark:text-orange-400">Keep it up!</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
