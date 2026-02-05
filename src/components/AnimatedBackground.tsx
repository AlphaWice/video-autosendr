import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
    });
  }
  return particles;
};

const particles = generateParticles(50);

export const AnimatedBackground: React.FC<{
  variant?: "default" | "grid" | "gradient";
}> = ({ variant = "default" }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            variant === "gradient"
              ? `radial-gradient(ellipse at 50% 50%, rgba(40,40,40,0.8) 0%, rgba(0,0,0,1) 70%)`
              : "transparent",
        }}
      />

      {/* Animated grid lines */}
      {variant === "grid" && (
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", opacity: 0.1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const offset = (frame * 0.5 + i * 50) % 1920;
            return (
              <line
                key={`v-${i}`}
                x1={offset}
                y1={0}
                x2={offset}
                y2={1080}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const offset = (frame * 0.3 + i * 50) % 1080;
            return (
              <line
                key={`h-${i}`}
                x1={0}
                y1={offset}
                x2={1920}
                y2={offset}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      )}

      {/* Floating particles */}
      {particles.map((particle, i) => {
        const y = (particle.y - frame * particle.speed) % 1080;
        const adjustedY = y < 0 ? y + 1080 : y;
        const pulse = Math.sin(frame * 0.05 + i) * 0.5 + 0.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: particle.x,
              top: adjustedY,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity: particle.opacity * pulse,
            }}
          />
        );
      })}

      {/* Animated glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          transform: `translate(${Math.sin(frame * 0.02) * 50}px, ${Math.cos(frame * 0.02) * 30}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          transform: `translate(${Math.cos(frame * 0.015) * 40}px, ${Math.sin(frame * 0.015) * 40}px)`,
        }}
      />
    </div>
  );
};
