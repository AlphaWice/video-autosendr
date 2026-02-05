import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { GlowingOrb, AnimatedLines } from "../components/AnimatedShapes";

const UseCaseCard: React.FC<{
  text: string;
  icon: string;
  delay: number;
  index: number;
}> = ({ text, icon, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [80, 0]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  // Staggered reveal with line drawing
  const lineWidth = interpolate(progress, [0, 1], [0, 40]);

  // Subtle hover effect
  const glowPulse = Math.sin((frame - delay) * 0.1) * 0.2 + 0.8;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px) scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "20px 0",
      }}
    >
      {/* Animated line connector */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: "linear-gradient(90deg, #22c55e, transparent)",
          borderRadius: 1,
        }}
      />

      {/* Icon with glow */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(34,197,94,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 28,
          boxShadow: `0 0 ${20 * glowPulse}px rgba(34,197,94,0.2)`,
          border: "1px solid rgba(34,197,94,0.2)",
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <span
        style={{
          fontSize: 34,
          fontWeight: 500,
          color: "#fff",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const UseCasesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleX = interpolate(titleProgress, [0, 1], [-50, 0]);

  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  const useCases = [
    { text: "Appointment reminders", icon: "📅", delay: 25 },
    { text: "Follow-up at the perfect time", icon: "🎯", delay: 40 },
    { text: "Birthday & event messages", icon: "🎂", delay: 55 },
    { text: "Invoice reminders", icon: "💰", delay: 70 },
    { text: "Win back quiet clients", icon: "🔄", delay: 85 },
  ];

  // Animated counter
  const countProgress = interpolate(frame, [100, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="default" />
      <AnimatedLines />

      <GlowingOrb x={1700} y={200} size={250} color="#22c55e" delay={0} />
      <GlowingOrb x={150} y={800} size={200} color="#22c55e" delay={20} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 150,
            alignItems: "center",
          }}
        >
          {/* Left side - Title */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateX(${titleX}px)`,
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: 4,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Use Cases
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.1,
                letterSpacing: "-2px",
              }}
            >
              Perfect
              <br />
              <span style={{ color: "#22c55e" }}>for...</span>
            </div>

            {/* Animated stat */}
            <div
              style={{
                marginTop: 50,
                opacity: countProgress,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 64, fontWeight: 800, color: "#fff" }}>
                  {Math.round(countProgress * 20)}+
                </span>
                <span style={{ fontSize: 24, color: "#888", fontWeight: 500 }}>
                  common uses
                </span>
              </div>
            </div>
          </div>

          {/* Right side - List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={useCase.text}
                text={useCase.text}
                icon={useCase.icon}
                delay={useCase.delay}
                index={index}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
