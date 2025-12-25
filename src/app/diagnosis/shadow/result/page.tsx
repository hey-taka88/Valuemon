'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lantern from '@/components/Lantern';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useMonsterStore } from '@/stores/monsterStore';

const DETECTED_VALUES = [
    { id: 'V001', name: '達成', source: 'envy', confidence: 85, description: '目標を達成し、結果を出すことへの強い渇望' },
    { id: 'V051', name: '誠実', source: 'rage', confidence: 92, description: '嘘や裏切りを許さない、信念への忠誠' },
    { id: 'V021', name: '自由', source: 'loss', confidence: 78, description: '束縛からの解放、自己決定への欲求' },
];

export default function ShadowResultPage() {
    const router = useRouter();
    const { reset } = useDiagnosisStore();
    const { initMonster } = useMonsterStore();

    const handleCreateLantern = () => {
        // モンスターを初期化（火属性 = 達成系価値観）
        initMonster('fire', 'V001');
        reset();
        router.push('/lantern/create');
    };

    return (
        <main className="min-h-screen bg-[var(--bg-abyss)] pb-8">
            {/* ヘッダー */}
            <header className="p-4 text-center">
                <h1 className="text-2xl font-bold">診断結果</h1>
                <p className="text-sm text-gray-400 mt-1">シャドウから召喚された価値観</p>
            </header>

            {/* ランタンビジュアル */}
            <section className="py-6">
                <Lantern flameValue="達成" size="lg" animated={true} />
            </section>

            {/* 判決 */}
            <section className="px-4 mb-6">
                <div className="card card-glow text-center">
                    <h2 className="text-lg font-bold mb-4 text-[var(--flame-glow)]">
                        ⚖️ 判決
                    </h2>
                    <p className="text-gray-300 mb-4">
                        君のシャドウから、以下のコア価値観が検出された。
                    </p>
                    <div className="flex justify-center gap-4 text-2xl">
                        <span>💚</span>
                        <span>🔥</span>
                        <span>💔</span>
                    </div>
                </div>
            </section>

            {/* 検出された価値観リスト */}
            <section className="px-4 mb-6 space-y-4">
                {DETECTED_VALUES.map((value) => (
                    <div key={value.id} className="card">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <span className="text-xs text-gray-400">
                                    {value.source === 'envy' && '💚 嫉妬から'}
                                    {value.source === 'rage' && '🔥 怒りから'}
                                    {value.source === 'loss' && '💔 喪失から'}
                                </span>
                                <h3 className="text-xl font-bold text-[var(--flame-glow)]">
                                    {value.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400">確信度</span>
                                <p className="text-lg font-bold text-[var(--accent-success)]">
                                    {value.confidence}%
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{value.description}</p>

                        {/* 確信度バー */}
                        <div className="stat-bar mt-3">
                            <div
                                className="stat-bar-fill"
                                style={{
                                    width: `${value.confidence}%`,
                                    background: 'var(--accent-success)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* 分析サマリー */}
            <section className="px-4 mb-8">
                <div className="card bg-[var(--bg-surface)]">
                    <h3 className="font-semibold mb-3">📊 分析サマリー</h3>
                    <ul className="text-sm text-gray-400 space-y-2">
                        <li>
                            <strong className="text-white">隠された野心:</strong>
                            成功や達成への強い渇望。表向きは控えめだが、内心は「認められたい」という欲求がある。
                        </li>
                        <li>
                            <strong className="text-white">譲れない正義:</strong>
                            誠実さと信頼を最優先視。約束を破る人間への怒りは、自分自身にも同じ基準を課している証拠。
                        </li>
                        <li>
                            <strong className="text-white">自我の土台:</strong>
                            自由と自己決定権。これを失うと「自分が自分でなくなる」感覚がある。
                        </li>
                    </ul>
                </div>
            </section>

            {/* アクションボタン */}
            <section className="px-4 space-y-3">
                <button
                    onClick={handleCreateLantern}
                    className="btn-primary w-full"
                >
                    🏮 ランタンを構築する
                </button>

                <Link href="/" className="block">
                    <button className="w-full bg-[var(--bg-surface)] border border-white/10 text-white rounded-xl py-4 font-semibold">
                        ホームに戻る
                    </button>
                </Link>
            </section>
        </main>
    );
}
