'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import Lantern from '@/components/Lantern';
import { useMonsterStore } from '@/stores/monsterStore';

export default function HomePage() {
  const { monster, streak, logAction } = useMonsterStore();

  const handleLv1Action = () => {
    logAction(1);
    // TODO: 成功アニメーションを表示
  };

  return (
    <main className="min-h-screen bg-[var(--bg-abyss)] pb-24">
      {/* ヘッダー */}
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--flame-glow)] to-[var(--flame-core)] bg-clip-text text-transparent">
          Shadow Lantern
        </h1>
        <p className="text-sm text-gray-400 mt-1">影から価値観を召喚する</p>
      </header>

      {/* ランタン表示 */}
      <section className="py-8">
        <Lantern
          flameValue={monster ? "達成" : "?"}
          size="lg"
          animated={true}
        />
      </section>

      {/* TODAY'S FLAME */}
      <section className="text-center mb-6">
        <p className="text-sm text-gray-400">TODAY&apos;S FLAME</p>
        <p className="text-lg font-semibold text-[var(--flame-glow)]">
          {monster ? "達成 × 誠実" : "まだ灯されていません"}
        </p>
      </section>

      {/* Lv.1 アクションボタン */}
      <section className="px-6 mb-8">
        {monster ? (
          <button
            onClick={handleLv1Action}
            className="btn-primary btn-lv1 mx-auto block"
          >
            ⚡ Lv.1 着手
            <span className="block text-sm opacity-80 mt-1">これだけでOK!</span>
          </button>
        ) : (
          <Link href="/diagnosis" className="block">
            <button className="btn-primary btn-lv1 mx-auto block">
              🔮 診断を開始
              <span className="block text-sm opacity-80 mt-1">影から価値観を召喚しよう</span>
            </button>
          </Link>
        )}
      </section>

      {/* ストリーク表示 */}
      {streak > 0 && (
        <section className="text-center mb-6">
          <span className="streak-badge">
            🏆 {streak}日連続
          </span>
        </section>
      )}

      {/* モンスターステータス */}
      {monster && (
        <section className="px-6 mb-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">MONSTER STATUS</h3>
            <div className="flex justify-between text-sm">
              {[
                { key: 'openness', label: 'O', color: 'var(--bf-openness)' },
                { key: 'conscientiousness', label: 'C', color: 'var(--bf-conscientiousness)' },
                { key: 'extraversion', label: 'E', color: 'var(--bf-extraversion)' },
                { key: 'agreeableness', label: 'A', color: 'var(--bf-agreeableness)' },
                { key: 'emotionalStability', label: 'S', color: 'var(--bf-stability)' },
              ].map(({ key, label, color }) => (
                <div key={key} className="text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-1 mx-auto"
                    style={{ background: color }}
                  >
                    {label}
                  </div>
                  <span className="text-gray-300">
                    {monster.bigFive[key as keyof typeof monster.bigFive]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* クイックアクション */}
      <section className="px-6 grid grid-cols-2 gap-4">
        <Link href="/diagnosis" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🔮</div>
          <h3 className="font-semibold">診断</h3>
          <p className="text-xs text-gray-400">シャドウを探る</p>
        </Link>

        <Link href="/lantern" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🏮</div>
          <h3 className="font-semibold">ランタン</h3>
          <p className="text-xs text-gray-400">行動指針を見る</p>
        </Link>

        <Link href="/monster" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">🐉</div>
          <h3 className="font-semibold">育成</h3>
          <p className="text-xs text-gray-400">モンスターを育てる</p>
        </Link>

        <Link href="/skills" className="card hover:border-[var(--flame-glow)] transition-colors">
          <div className="text-3xl mb-2">⚔️</div>
          <h3 className="font-semibold">スキル</h3>
          <p className="text-xs text-gray-400">心理スキルを使う</p>
        </Link>
      </section>

      <BottomNav />
    </main>
  );
}
