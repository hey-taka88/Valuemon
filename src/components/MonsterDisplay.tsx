'use client';

import { useMonsterStore } from '@/stores/monsterStore';

const ELEMENT_COLORS: Record<string, string> = {
    fire: 'var(--element-fire)',
    water: 'var(--element-water)',
    wind: 'var(--element-wind)',
    earth: 'var(--element-earth)',
    light: 'var(--element-light)',
    dark: 'var(--element-dark)',
};

const ELEMENT_EMOJIS: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    wind: '🌪️',
    earth: '🏔️',
    light: '✨',
    dark: '🌑',
};

const FORM_NAMES: Record<string, string> = {
    wisp: 'ウィスプ',
    ember: 'エンバー',
    ignite: 'イグナイト',
    blaze: 'ブレイズ',
    inferno: 'インフェルノ',
    phoenix: 'フェニックス',
};

export default function MonsterDisplay() {
    const { monster } = useMonsterStore();

    if (!monster) {
        return (
            <div className="monster-card">
                <p className="text-gray-400">モンスターはまだ生まれていません</p>
                <p className="text-sm text-gray-500 mt-2">診断を完了して召喚しましょう</p>
            </div>
        );
    }

    const elementColor = ELEMENT_COLORS[monster.element] || '#fff';
    const elementEmoji = ELEMENT_EMOJIS[monster.element] || '❓';
    const formName = FORM_NAMES[monster.currentForm] || monster.currentForm;

    return (
        <div className="monster-card" style={{ borderColor: elementColor }}>
            {/* モンスタービジュアル */}
            <div
                className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center flame-pulse"
                style={{
                    background: `radial-gradient(circle, ${elementColor}40, ${elementColor}10)`,
                    border: `2px solid ${elementColor}`,
                }}
            >
                <span className="text-6xl">{elementEmoji}</span>
            </div>

            {/* 名前と属性 */}
            <h3 className="text-xl font-bold mb-1">{formName}</h3>
            <p className="text-sm text-gray-400 mb-4">
                {elementEmoji} {monster.element.toUpperCase()} 属性
            </p>

            {/* XP */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span>Total XP</span>
                    <span className="text-[var(--accent-gold)]">{monster.totalXp}</span>
                </div>
                <div className="stat-bar">
                    <div
                        className="stat-bar-fill"
                        style={{
                            width: `${Math.min((monster.totalXp % 500) / 5, 100)}%`,
                            background: elementColor,
                        }}
                    />
                </div>
            </div>

            {/* ビッグファイブ */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                    { key: 'openness', label: 'O', color: 'var(--bf-openness)' },
                    { key: 'conscientiousness', label: 'C', color: 'var(--bf-conscientiousness)' },
                    { key: 'extraversion', label: 'E', color: 'var(--bf-extraversion)' },
                    { key: 'agreeableness', label: 'A', color: 'var(--bf-agreeableness)' },
                    { key: 'emotionalStability', label: 'S', color: 'var(--bf-stability)' },
                ].map(({ key, label, color }) => (
                    <div key={key}>
                        <div
                            className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-1"
                            style={{ background: color }}
                        >
                            {label}
                        </div>
                        <span>{monster.bigFive[key as keyof typeof monster.bigFive]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
