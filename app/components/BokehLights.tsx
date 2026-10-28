import { useMemo } from "react";

const BokehLights = () => {
    const lights = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: Math.random() * 20 + 8,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 4,
            duration: Math.random() * 3 + 4,
            color: [
                "hsl(43 74% 49% / 0.5)",   // gold
                "hsl(0 65% 50% / 0.4)",     // red
                "hsl(140 50% 40% / 0.4)",   // green
                "hsl(40 30% 90% / 0.6)",    // cream/white
                "hsl(25 80% 60% / 0.4)",    // warm orange
            ][Math.floor(Math.random() * 5)],
        }));
    }, []);

    return (
        <div className="bokeh-container">
            {lights.map((light) => (
                <div
                    key={light.id}
                    className="bokeh-light"
                    style={{
                        width: light.size,
                        height: light.size,
                        left: `${light.left}%`,
                        top: `${light.top}%`,
                        backgroundColor: light.color,
                        animationDelay: `${light.delay}s`,
                        animationDuration: `${light.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default BokehLights;
