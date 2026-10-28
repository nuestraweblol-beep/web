// Hand-drawn, "child crayon drawing" style doodles — one per chapter, no photo assets needed.
const INK = "#5c4632";
const S = { fill: "none", stroke: INK, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Sun({ cx, cy, r = 14, color = "#f4c542" }: { cx: number; cy: number; r?: number; color?: string }) {
    const rays = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * (r + 4);
        const y1 = cy + Math.sin(a) * (r + 4);
        const x2 = cx + Math.cos(a) * (r + 12);
        const y2 = cy + Math.sin(a) * (r + 12);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...S} strokeWidth={3} />;
    });
    return (
        <g>
            {rays}
            <circle cx={cx} cy={cy} r={r} fill={color} stroke={INK} strokeWidth={3} />
        </g>
    );
}

function Heart({ x, y, s = 1, color = "#e5533c" }: { x: number; y: number; s?: number; color?: string }) {
    return (
        <path
            d={`M ${x} ${y + 6 * s} C ${x - 14 * s} ${y - 10 * s}, ${x - 2 * s} ${y - 20 * s}, ${x} ${y - 8 * s} C ${x + 2 * s} ${y - 20 * s}, ${x + 14 * s} ${y - 10 * s}, ${x} ${y + 6 * s} Z`}
            fill={color}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
        />
    );
}

function Star({ cx, cy, r = 6, color = "#f4c542" }: { cx: number; cy: number; r?: number; color?: string }) {
    const pts = Array.from({ length: 4 }, (_, i) => {
        const a = (i / 4) * Math.PI * 2 + 0.3;
        return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
    }).join(" ");
    return <polygon points={pts} fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />;
}

function Figure({ x, y, color = "#6fb3d9", crown, dress }: { x: number; y: number; color?: string; crown?: boolean; dress?: boolean }) {
    return (
        <g>
            <circle cx={x} cy={y} r={10} fill="#f6efe4" stroke={INK} strokeWidth={4} />
            <circle cx={x - 3} cy={y - 1} r={1.4} fill={INK} />
            <circle cx={x + 3} cy={y - 1} r={1.4} fill={INK} />
            <path d={`M ${x - 3} ${y + 4} Q ${x} ${y + 6} ${x + 3} ${y + 4}`} {...S} strokeWidth={2} />
            {crown && (
                <polyline
                    points={`${x - 8},${y - 10} ${x - 5},${y - 17} ${x - 1},${y - 11} ${x + 2},${y - 18} ${x + 5},${y - 11} ${x + 8},${y - 16} ${x + 8},${y - 10}`}
                    fill="#f4c542"
                    stroke={INK}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                />
            )}
            {dress ? (
                <path d={`M ${x - 4} ${y + 10} L ${x - 12} ${y + 34} L ${x + 12} ${y + 34} L ${x + 4} ${y + 10} Z`} fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            ) : (
                <line x1={x} y1={y + 10} x2={x} y2={y + 30} {...S} />
            )}
            <line x1={x} y1={y + 34} x2={x - 6} y2={y + 46} {...S} />
            <line x1={x} y1={y + 34} x2={x + 6} y2={y + 46} {...S} />
            {!dress && (
                <>
                    <line x1={x} y1={y + 16} x2={x - 10} y2={y + 24} {...S} />
                    <line x1={x} y1={y + 16} x2={x + 10} y2={y + 24} {...S} />
                </>
            )}
        </g>
    );
}

function Cloud({ x, y, color = "#e8e0d0" }: { x: number; y: number; color?: string }) {
    return (
        <g stroke={INK} strokeWidth={3} fill={color}>
            <circle cx={x} cy={y} r={10} />
            <circle cx={x + 11} cy={y - 4} r={13} />
            <circle cx={x + 24} cy={y} r={9} />
            <rect x={x - 8} y={y + 2} width={40} height={10} fill={color} stroke="none" />
        </g>
    );
}

function Ground({ w = 300 }: { w?: number }) {
    return <path d={`M 0 185 Q ${w / 4} 178, ${w / 2} 184 T ${w} 182`} {...S} strokeWidth={4} stroke="#8b9a5b" />;
}

export function Cap1() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Sun cx={252} cy={30} />
            <g stroke={INK} strokeWidth={4} fill="#e8d9c0">
                <rect x={40} y={90} width={60} height={60} />
                <polygon points="40,90 70,62 100,90" fill="#c48b5a" />
                <rect x={62} y={112} width={16} height={38} fill="#8b5e3c" />
                <rect x={30} y={78} width={14} height={18} fill="#e8d9c0" />
                <rect x={96} y={78} width={14} height={18} fill="#e8d9c0" />
            </g>
            <Figure x={175} y={125} color="#e58fb0" dress crown />
            <Star cx={200} cy={40} />
            <Star cx={225} cy={70} r={4} />
            <Ground />
        </svg>
    );
}

export function Cap2() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Figure x={95} y={115} color="#6fb3d9" />
            <Figure x={205} y={115} color="#9b6bc9" />
            <Heart x={150} y={95} s={2.2} />
            <Star cx={110} cy={55} />
            <Star cx={190} cy={50} r={5} color="#e5533c" />
            <Star cx={150} cy={35} r={4} />
            <Ground />
        </svg>
    );
}

export function Cap3() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Figure x={60} y={125} color="#6fb3d9" />
            <Figure x={240} y={125} color="#e58fb0" dress />
            <path d="M 90 150 Q 150 130, 210 150" {...S} strokeWidth={2} strokeDasharray="6 8" />
            <line x1={150} y1={140} x2={150} y2={185} {...S} strokeWidth={4} stroke="#8b9a5b" />
            <Heart x={150} y={130} s={1.5} color="#e58fb0" />
            <Ground />
        </svg>
    );
}

export function Cap4() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <g stroke={INK} strokeWidth={3} fill="none">
                <circle cx={253} cy={35} r={13} fill="#f6efe4" />
                <path d="M 262 28 Q 253 24, 248 32" fill="#5c4632" stroke="none" />
            </g>
            <g stroke={INK} strokeWidth={4}>
                <line x1={70} y1={150} x2={70} y2={95} stroke="#8b5e3c" />
                <circle cx={70} cy={70} r={26} fill="#6faa4a" />
            </g>
            <g>
                <ellipse cx={185} cy={145} rx={22} ry={26} fill="#9b6bc9" stroke={INK} strokeWidth={4} />
                <circle cx={177} cy={138} r={2.5} fill={INK} />
                <circle cx={193} cy={138} r={2.5} fill={INK} />
                <path d="M 176 150 Q 185 158, 194 150" {...S} strokeWidth={2.5} />
                <line x1={165} y1={140} x2={155} y2={128} {...S} strokeWidth={3} />
                <line x1={205} y1={140} x2={218} y2={150} {...S} strokeWidth={3} />
                <path d="M 218 158 L 224 150 L 232 150 L 226 160 Z" fill="#e5533c" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
            </g>
            <Heart x={130} y={90} s={1.3} />
            <Ground />
        </svg>
    );
}

export function Cap5() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <rect x={30} y={60} width={240} height={110} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="7 6" />
            <line x1={150} y1={60} x2={150} y2={170} {...S} strokeWidth={2} strokeDasharray="4 6" />
            <circle cx={150} cy={115} r={11} fill="#f4c542" stroke={INK} strokeWidth={3} />
            <path d="M 140 115 L 160 115 M 150 105 L 150 125" stroke={INK} strokeWidth={2} />
            <Figure x={80} y={125} color="#6fb3d9" />
            <path d={`M 215 90 C 205 78, 210 68, 218 76 C 224 66, 234 74, 226 86 Z`} fill="#e5533c" stroke={INK} strokeWidth={3} transform="rotate(18 220 80)" />
            <path d={`M 236 84 C 246 96, 240 106, 232 98 C 226 108, 216 100, 224 88 Z`} fill="#e5533c" stroke={INK} strokeWidth={3} transform="rotate(18 230 96)" />
            <Ground />
        </svg>
    );
}

export function Cap6() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Sun cx={40} cy={35} r={16} />
            <Star cx={90} cy={30} r={5} />
            <Star cx={230} cy={40} r={5} color="#e5533c" />
            <Star cx={260} cy={70} r={4} />
            <g>
                <circle cx={110} cy={130} r={10} fill="#f6efe4" stroke={INK} strokeWidth={4} />
                <circle cx={107} cy={128} r={1.4} fill={INK} />
                <circle cx={113} cy={128} r={1.4} fill={INK} />
                <path d="M 106 133 Q 110 135, 114 133" {...S} strokeWidth={2} />
                <line x1={110} y1={140} x2={110} y2={152} {...S} />
                <line x1={110} y1={152} x2={100} y2={165} {...S} />
                <line x1={110} y1={152} x2={110} y2={166} {...S} />
                <line x1={110} y1={144} x2={98} y2={150} {...S} />
                <line x1={110} y1={144} x2={122} y2={140} {...S} />
                <rect x={118} y={150} width={12} height={9} fill="#e8823a" stroke={INK} strokeWidth={2.5} />
            </g>
            <Figure x={200} y={125} color="#e58fb0" dress />
            <Heart x={150} y={80} s={2} />
            <Ground />
        </svg>
    );
}

export function Cap7() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Star cx={150} cy={30} r={12} color="#f4c542" />
            <g>
                <circle cx={150} cy={110} r={11} fill="#f6efe4" stroke={INK} strokeWidth={4} />
                <circle cx={147} cy={108} r={1.5} fill={INK} />
                <circle cx={153} cy={108} r={1.5} fill={INK} />
                <path d="M 145 113 Q 150 117, 155 113" {...S} strokeWidth={2.5} />
                <line x1={150} y1={121} x2={150} y2={150} {...S} strokeWidth={5} />
                <line x1={150} y1={150} x2={140} y2={172} {...S} />
                <line x1={150} y1={150} x2={160} y2={172} {...S} />
                <line x1={150} y1={130} x2={135} y2={122} {...S} />
                <line x1={150} y1={130} x2={165} y2={122} {...S} />
                <Heart x={150} y={137} s={0.8} />
            </g>
            <g transform="translate(60 90)" stroke={INK} strokeWidth={3}>
                <rect x={0} y={0} width={22} height={22} rx={4} fill="#f4c542" />
                <rect x={16} y={8} width={22} height={22} rx={4} fill="#6fb3d9" />
            </g>
            <g transform="translate(210 95)" stroke={INK} strokeWidth={3}>
                <rect x={0} y={0} width={20} height={20} rx={4} fill="#e58fb0" />
                <rect x={-14} y={6} width={20} height={20} rx={4} fill="#9b6bc9" />
            </g>
            <Ground />
        </svg>
    );
}

export function Cap8() {
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Cloud x={100} y={35} />
            <g stroke="#6fb3d9" strokeWidth={3} strokeLinecap="round">
                <line x1={105} y1={58} x2={100} y2={70} />
                <line x1={120} y1={58} x2={115} y2={70} />
                <line x1={135} y1={58} x2={130} y2={70} />
            </g>
            <g>
                <circle cx={150} cy={120} r={10} fill="#f6efe4" stroke={INK} strokeWidth={4} />
                <path d="M 146 122 Q 150 118, 154 122" {...S} strokeWidth={2.5} />
                <line x1={150} y1={130} x2={150} y2={155} {...S} />
                <line x1={150} y1={155} x2={142} y2={172} {...S} />
                <line x1={150} y1={155} x2={158} y2={172} {...S} />
                <line x1={150} y1={138} x2={140} y2={148} {...S} />
                <line x1={150} y1={138} x2={160} y2={148} {...S} />
            </g>
            <ellipse cx={150} cy={178} rx={26} ry={5} fill="#9fc3d9" opacity={0.6} stroke="none" />
            <path d={`M 210 70 C 200 58, 205 48, 213 56 C 219 46, 229 54, 221 66 Z`} fill="#e5533c" stroke={INK} strokeWidth={3} transform="rotate(-10 215 60)" />
            <path d={`M 236 72 C 246 84, 240 94, 232 86 C 226 96, 216 88, 224 76 Z`} fill="#e5533c" stroke={INK} strokeWidth={3} transform="rotate(15 230 84)" />
            <Ground />
        </svg>
    );
}

export function CapEpilogo() {
    const light = "#f1e7d6";
    return (
        <svg viewBox="0 0 300 200" width="100%" height="100%">
            <Sun cx={250} cy={150} r={22} color="#e8823a" />
            <g stroke={light} strokeWidth={4} fill="#c9a877">
                <rect x={110} y={55} width={80} height={120} />
                <line x1={150} y1={55} x2={150} y2={175} strokeWidth={3} />
                <path d="M 190 60 L 210 68 L 210 172 L 190 175 Z" fill="#a8703f" />
            </g>
            <text x={130} y={125} fontSize={46} fontFamily="Georgia, serif" fill={light} stroke="none">?</text>
            <Heart x={230} y={40} s={1.2} color="#e5533c" />
            <path d="M 0 185 Q 75 178, 150 184 T 300 182" stroke={light} strokeWidth={4} fill="none" strokeLinecap="round" />
        </svg>
    );
}

export const chapterArt: Record<string, () => React.ReactElement> = {
    "Capítulo 1": Cap1,
    "Capítulo 2": Cap2,
    "Capítulo 3": Cap3,
    "Capítulo 4": Cap4,
    "Capítulo 5": Cap5,
    "Capítulo 6": Cap6,
    "Capítulo 7": Cap7,
    "Capítulo 8": Cap8,
    "Epílogo": CapEpilogo,
};
