'use client';

interface LanternProps {
    flameValue?: string;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

export default function Lantern({
    flameValue = '',
    size = 'md',
    animated = true
}: LanternProps) {
    const sizes = {
        sm: { container: 'w-24 h-36', flame: 'w-8 h-10', body: 'w-16 h-20' },
        md: { container: 'w-40 h-60', flame: 'w-12 h-16', body: 'w-28 h-36' },
        lg: { container: 'w-52 h-80', flame: 'w-16 h-20', body: 'w-36 h-44' },
    };

    const s = sizes[size];

    return (
        <div className={`relative ${s.container} mx-auto`}>
            {/* 炎 */}
            <div
                className={`
          absolute top-2 left-1/2 -translate-x-1/2 
          ${s.flame} 
          rounded-[50%_50%_50%_50%/60%_60%_40%_40%]
          ${animated ? 'animate-[flameFlicker_0.5s_ease-in-out_infinite_alternate]' : ''}
        `}
                style={{
                    background: 'radial-gradient(ellipse at bottom, var(--flame-glow), var(--flame-core), transparent)',
                }}
            />

            {/* ランタン本体 */}
            <div
                className={`
          absolute top-[30%] left-1/2 -translate-x-1/2
          ${s.body}
          rounded-[10px_10px_20px_20px]
          border-2 border-[var(--flame-ember)]
          flex items-center justify-center
        `}
                style={{
                    background: 'linear-gradient(180deg, rgba(255, 165, 0, 0.25), rgba(255, 107, 53, 0.1))',
                }}
            >
                {/* Flame Value */}
                {flameValue && (
                    <span
                        className="text-center font-bold px-2"
                        style={{
                            color: 'var(--flame-glow)',
                            textShadow: '0 0 10px var(--flame-glow)',
                            fontSize: size === 'lg' ? '1.25rem' : size === 'md' ? '1rem' : '0.75rem',
                        }}
                    >
                        {flameValue}
                    </span>
                )}
            </div>

            {/* ハンドル（上部） */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-full"
                style={{
                    background: 'var(--flame-ember)',
                    opacity: 0.8,
                }}
            />

            {/* 光の効果 */}
            <div
                className={`
          absolute top-[25%] left-1/2 -translate-x-1/2
          w-48 h-48 rounded-full pointer-events-none
          ${animated ? 'animate-pulse' : ''}
        `}
                style={{
                    background: 'radial-gradient(circle, rgba(255, 165, 0, 0.15), transparent 70%)',
                }}
            />
        </div>
    );
}
