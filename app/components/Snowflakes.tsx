import { useMemo } from "react";

const Snowflakes = () => {
    const snowflakes = useMemo(() => {
        return Array.from({ length: 25 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: Math.random() * 10 + 10,
            opacity: Math.random() * 0.5 + 0.3,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake absolute rounded-full"
                    style={{
                        width: flake.size,
                        height: flake.size,
                        left: `${flake.left}%`,
                        top: -10,
                        backgroundColor: `hsl(40 30% 95% / ${flake.opacity})`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Snowflakes;
