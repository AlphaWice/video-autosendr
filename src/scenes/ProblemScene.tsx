import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { AnimatedLines } from "../components/AnimatedShapes";

const AnimatedProblemCard: React.FC<{
  text: string;
  icon: React.ReactNode;
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

  const x = interpolate(progress, [0, 1], [-100, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  // Shake animation for problem emphasis
  const shake = frame > delay + 20 && frame < delay + 35
    ? Math.sin((frame - delay - 20) * 2) * 3
    : 0;

  // Glow pulse
  const glowPulse = Math.sin((frame - delay) * 0.1) * 0.3 + 0.7;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x + shake}px) scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "24px 40px",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        border: "1px solid rgba(255,107,107,0.2)",
        marginBottom: 20,
        boxShadow: `0 0 ${30 * glowPulse}px rgba(255,107,107,0.1)`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          backgroundColor: "rgba(255,107,107,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ff6b6b",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 38,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const CrossIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="20"
        strokeDashoffset={20 - 20 * progress}
      />
      <path
        d="M6 6l12 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="20"
        strokeDashoffset={20 - 20 * progress}
      />
    </svg>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  const problems = [
    { text: "Scattered messaging", delay: 20 },
    { text: "Missed follow-ups", delay: 40 },
    { text: "Lost leads", delay: 60 },
  ];

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="default" />
      <AnimatedLines />

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
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontSize: 28,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: 6,
              marginBottom: 60,
              fontWeight: 600,
            }}
          >
            The Problem
          </div>

          {/* Problem cards */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {problems.map((problem, index) => (
              <AnimatedProblemCard
                key={problem.text}
                text={problem.text}
                icon={<CrossIcon delay={problem.delay} />}
                delay={problem.delay}
                index={index}
              />
            ))}
          </div>

          {/* Animated warning pulse */}
          <div
            style={{
              position: "absolute",
              width: 800,
              height: 800,
              borderRadius: "50%",
              border: "2px solid rgba(255,107,107,0.1)",
              animation: "none",
              transform: `scale(${1 + Math.sin(frame * 0.05) * 0.1})`,
              opacity: 0.3,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
