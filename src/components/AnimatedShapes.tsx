import { useCurrentFrame, interpolate } from "remotion";

export const FloatingShapes: React.FC = () => {
  const frame = useCurrentFrame();

  const shapes = [
    { type: "circle", x: 150, y: 200, size: 80, speed: 0.02, delay: 0 },
    { type: "square", x: 1700, y: 300, size: 60, speed: 0.025, delay: 10 },
    { type: "circle", x: 200, y: 800, size: 40, speed: 0.03, delay: 20 },
    { type: "square", x: 1600, y: 700, size: 50, speed: 0.018, delay: 5 },
    { type: "circle", x: 1750, y: 150, size: 30, speed: 0.022, delay: 15 },
    { type: "square", x: 100, y: 500, size: 45, speed: 0.028, delay: 25 },
  ];

  return (
    <>
      {shapes.map((shape, i) => {
        const floatY = Math.sin((frame + shape.delay) * shape.speed) * 30;
        const floatX = Math.cos((frame + shape.delay) * shape.speed * 0.7) * 20;
        const rotation = frame * shape.speed * 50;
        const pulse = Math.sin(frame * 0.05 + i) * 0.1 + 0.9;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: shape.x + floatX,
              top: shape.y + floatY,
              width: shape.size * pulse,
              height: shape.size * pulse,
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: shape.type === "circle" ? "50%" : "8px",
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

export const GlowingOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color?: string;
  delay?: number;
}> = ({ x, y, size, color = "#fff", delay = 0 }) => {
  const frame = useCurrentFrame();

  const pulse = Math.sin((frame - delay) * 0.08) * 0.3 + 0.7;
  const floatY = Math.sin((frame - delay) * 0.03) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + floatY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        opacity: pulse,
        filter: `blur(${size * 0.1}px)`,
      }}
    />
  );
};

export const AnimatedLines: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width="1920"
      height="1080"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* Animated diagonal lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const progress = ((frame * 2 + i * 100) % 600) / 600;
        const opacity = interpolate(progress, [0, 0.5, 1], [0, 0.08, 0]);
        const x = interpolate(progress, [0, 1], [-200, 2120]);

        return (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x - 400}
            y2={1080}
            stroke="#fff"
            strokeWidth="1"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

export const PulsingRing: React.FC<{
  x: number;
  y: number;
  size: number;
  delay?: number;
}> = ({ x, y, size, delay = 0 }) => {
  const frame = useCurrentFrame();

  const rings = [0, 20, 40];

  return (
    <>
      {rings.map((ringDelay, i) => {
        const progress = ((frame - delay - ringDelay) % 60) / 60;
        const scale = interpolate(progress, [0, 1], [0.5, 1.5]);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.15, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(34,197,94,0.2)",
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};
