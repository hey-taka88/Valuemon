import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MonsterStatus, BigFiveStats, MonsterElement, EvolutionStage, ActionLevel } from '@/types';

interface MonsterStore {
    // 状態
    monster: MonsterStatus | null;
    streak: number;
    lastActionDate: string | null;

    // アクション
    initMonster: (element: MonsterElement, primaryValueId: string) => void;
    addXp: (amount: number) => void;
    updateStats: (changes: Partial<BigFiveStats>) => void;
    logAction: (level: ActionLevel) => void;
    unlockSkill: (skillId: string) => void;
    checkEvolution: () => boolean;
    evolve: () => void;
    addDarksideWarning: (warning: string) => void;
}

const EVOLUTION_THRESHOLDS: Record<EvolutionStage, number> = {
    wisp: 0,
    ember: 100,
    ignite: 500,
    blaze: 1500,
    inferno: 5000,
    phoenix: 15000,
};

const EVOLUTION_ORDER: EvolutionStage[] = ['wisp', 'ember', 'ignite', 'blaze', 'inferno', 'phoenix'];

const XP_BY_LEVEL: Record<ActionLevel, number> = {
    1: 5,
    2: 15,
    3: 30,
    4: 50,
    5: 100,
};

export const useMonsterStore = create<MonsterStore>()(
    persist(
        (set, get) => ({
            monster: null,
            streak: 0,
            lastActionDate: null,

            initMonster: (element, primaryValueId) => {
                const newMonster: MonsterStatus = {
                    id: crypto.randomUUID(),
                    userId: 'local-user',
                    bigFive: {
                        openness: 50,
                        conscientiousness: 50,
                        extraversion: 50,
                        agreeableness: 50,
                        emotionalStability: 50,
                    },
                    element,
                    currentForm: 'wisp',
                    totalXp: 0,
                    unlockedSkills: [],
                    darksideWarnings: [],
                };
                set({ monster: newMonster });
            },

            addXp: (amount) => {
                const { monster } = get();
                if (!monster) return;

                set({
                    monster: {
                        ...monster,
                        totalXp: monster.totalXp + amount,
                    }
                });
            },

            updateStats: (changes) => {
                const { monster } = get();
                if (!monster) return;

                const newStats = { ...monster.bigFive };
                for (const [key, value] of Object.entries(changes)) {
                    const statKey = key as keyof BigFiveStats;
                    newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value || 0)));
                }

                set({
                    monster: {
                        ...monster,
                        bigFive: newStats,
                    }
                });
            },

            logAction: (level) => {
                const today = new Date().toDateString();
                const { lastActionDate, streak, monster } = get();

                // ストリーク計算
                let newStreak = streak;
                if (lastActionDate === today) {
                    // 同じ日は変更なし
                } else if (lastActionDate === new Date(Date.now() - 86400000).toDateString()) {
                    // 前日に行動していたらストリーク継続
                    newStreak = streak + 1;
                } else {
                    // それ以外はリセット
                    newStreak = 1;
                }

                // XP追加
                const xpGain = XP_BY_LEVEL[level];

                set({
                    lastActionDate: today,
                    streak: newStreak,
                });

                get().addXp(xpGain);

                // レベルに応じたステータス変化
                if (level >= 3) {
                    get().updateStats({ conscientiousness: 2 });
                }
                if (level >= 4) {
                    get().updateStats({ openness: 3 });
                }
            },

            unlockSkill: (skillId) => {
                const { monster } = get();
                if (!monster || monster.unlockedSkills.includes(skillId)) return;

                set({
                    monster: {
                        ...monster,
                        unlockedSkills: [...monster.unlockedSkills, skillId],
                    }
                });
            },

            checkEvolution: () => {
                const { monster } = get();
                if (!monster) return false;

                const currentIndex = EVOLUTION_ORDER.indexOf(monster.currentForm);
                if (currentIndex >= EVOLUTION_ORDER.length - 1) return false;

                const nextStage = EVOLUTION_ORDER[currentIndex + 1];
                const threshold = EVOLUTION_THRESHOLDS[nextStage];

                return monster.totalXp >= threshold;
            },

            evolve: () => {
                const { monster } = get();
                if (!monster) return;

                const currentIndex = EVOLUTION_ORDER.indexOf(monster.currentForm);
                if (currentIndex >= EVOLUTION_ORDER.length - 1) return;

                const nextStage = EVOLUTION_ORDER[currentIndex + 1];

                set({
                    monster: {
                        ...monster,
                        currentForm: nextStage,
                    }
                });
            },

            addDarksideWarning: (warning) => {
                const { monster } = get();
                if (!monster || monster.darksideWarnings.includes(warning)) return;

                set({
                    monster: {
                        ...monster,
                        darksideWarnings: [...monster.darksideWarnings, warning],
                    }
                });
            },
        }),
        {
            name: 'monster-storage',
        }
    )
);
