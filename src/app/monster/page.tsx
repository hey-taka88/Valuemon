'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import MonsterDisplay from '@/components/MonsterDisplay';
import { useMonsterStore } from '@/stores/monsterStore';

const EVOLUTION_STAGES = [
    { id: 'wisp', name: 'ウィスプ', xp: 0, emoji: '💫' },
    { id: 'ember', name: 'エンバー', xp: 100, emoji: '🔥' },
    { id: 'ignite', name: 'イグナイト', xp: 500, emoji: '🌟' },
    { id: 'blaze', name: 'ブレイズ', xp: 1500, emoji: '⚡' },
    { id: 'inferno', name: 'インフェルノ', xp: 5000, emoji: '🌋' },
    { id: 'phoenix', name: 'フェニックス', xp: 15000, emoji: '🦅' },
];

export default function MonsterPage() {
    const { monster, streak, checkEvolution, evolve } = useMonsterStore();

    const canEvolve = checkEvolution();

    const handleEvolve = () => {
        if (canEvolve) {
            evolve();
            // TODO: 進化アニメーション
        }
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-24">
            {/* ヘッダー */}
            <header className="p-4">
                <h1 className="text-2xl font-bold">モンスター育成</h1>
                <p className="text-sm text-gray-400 mt-1">
                    価値観に基づく行動でモンスターを育てよう
                </p>
            </header>

            {monster ? (
                <>
                    {/* モンスター表示 */}
                    <section className="px-4 mb-6">
                        <MonsterDisplay />
                    </section>

                    {/* 進化ボタン */}
                    {canEvolve && (
                        <section className="px-4 mb-6">
                            <button
                                onClick={handleEvolve}
                                className="btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500"
                            >
                                ✨ 進化する！
                            </button>
                        </section>
                    )}

                    {/* 進化パス */}
                    <section className="px-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">進化パス</h3>
                        <div className="evolution-path">
                            {EVOLUTION_STAGES.map((stage, index) => {
                                const currentIndex = EVOLUTION_STAGES.findIndex(
                                    (s) => s.id === monster.currentForm
                                );
                                const isUnlocked = index <= currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                    <div
                                        key={stage.id}
                                        className={`evolution-stage ${isCurrent ? 'current' : ''} ${isUnlocked ? 'unlocked' : ''}`}
                                    >
                                        <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-2xl
                      ${isCurrent ? 'bg-[var(--flame-glow)]' : isUnlocked ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-surface)]'}
                    `}>
                                            {stage.emoji}
                                        </div>
                                        <span className="text-xs mt-1">{stage.name}</span>
                                        <span className="text-xs text-gray-500">{stage.xp}XP</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ストリーク */}
                    <section className="px-4 mb-6">
                        <div className="card text-center">
                            <span className="streak-badge text-lg">
                                🏆 {streak}日連続
                            </span>
                            <p className="text-sm text-gray-400 mt-3">
                                継続は力なり。毎日のLv.1行動がモンスターを強くする。
                            </p>
                        </div>
                    </section>

                    {/* アンロック済みスキル */}
                    <section className="px-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">アンロック済みスキル</h3>
                        {monster.unlockedSkills.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {monster.unlockedSkills.map((skillId) => (
                                    <div key={skillId} className="card">
                                        <span className="text-2xl">🛡️</span>
                                        <p className="text-sm font-semibold mt-1">{skillId}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                ステータスが上がるとスキルがアンロックされます
                            </p>
                        )}
                    </section>
                </>
            ) : (
                /* モンスター未作成時 */
                <section className="px-4 py-12 text-center">
                    <div className="text-8xl mb-6 opacity-30">🥚</div>

                    <h2 className="text-xl font-bold mb-3">モンスターはまだ生まれていません</h2>
                    <p className="text-gray-400 mb-6">
                        診断を完了して、あなたの価値観からモンスターを召喚しましょう
                    </p>

                    <Link href="/diagnosis">
                        <button className="btn-primary">
                            🔮 診断を開始する
                        </button>
                    </Link>
                </section>
            )}

            <BottomNav />
        </main>
    );
}
