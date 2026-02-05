import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { PulsingRing, GlowingOrb } from "../components/AnimatedShapes";
import { AnimatedShield } from "../components/AnimatedIcons";

export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shield animation
  const shieldProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Text animations
  const line1Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  const line2Progress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 200 },
  });

  const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1]);
  const line1Y = interpolate(line1Progress, [0, 1], [30, 0]);

  const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1]);
  const line2Y = interpolate(line2Progress, [0, 1], [30, 0]);

  // Lock animation
  const lockProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200 },
  });

  // Particle ring around shield
  const particleCount = 20;

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />

      {/* Multiple pulsing rings */}
      <PulsingRing x={960} y={400} size={300} delay={0} />
      <PulsingRing x={960} y={400} size={400} delay={20} />

      <GlowingOrb x={200} y={200} size={300} color="#22c55e" delay={0} />
      <GlowingOrb x={1700} y={800} size={250} color="#22c55e" delay={15} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
          }}
        >
          {/* Animated shield with orbiting particles */}
          <div style={{ position: "relative" }}>
            <AnimatedShield size={150} delay={0} />

            {/* Orbiting particles */}
            {Array.from({ length: particleCount }).map((_, i) => {
              const angle = (i / particleCount) * Math.PI * 2 + frame * 0.02;
              const radius = 100 + Math.sin(frame * 0.05 + i) * 10;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const size = 4 + Math.sin(frame * 0.1 + i) * 2;
              const opacity = interpolate(shieldProgress, [0, 0.5], [0, 0.6], {
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
                    opacity: opacity * (0.3 + Math.sin(frame * 0.1 + i) * 0.3),
                    boxShadow: "0 0 6px #22c55e",
                  }}
                />
              );
            })}

            {/* Lock icon inside shield */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${lockProgress})`,
              }}
            >
              <svg width="50" height="50" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="rgba(34,197,94,0.1)"
                />
                <path
                  d="M7 11V7a5 5 0 0110 0v4"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16" r="1.5" fill="#22c55e" />
              </svg>
            </div>
          </div>

          {/* Text with word-by-word reveal */}
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                opacity: line1Opacity,
                transform: `translateY(${line1Y}px)`,
                fontSize: 58,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 12,
                letterSpacing: "-1px",
              }}
            >
              Your messages stay private.
            </div>
            <div
              style={{
                opacity: line2Opacity,
                transform: `translateY(${line2Y}px)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 58, fontWeight: 700, color: "#22c55e" }}>
                Even from us.
              </span>
              {/* Animated checkmark */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                style={{
                  transform: `scale(${line2Progress})`,
                }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="#22c55e"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 20,
              opacity: interpolate(frame, [50, 70], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {["End-to-end", "Zero access", "Your data"].map((text, i) => {
              const itemProgress = spring({
                frame: frame - 55 - i * 8,
                fps,
                config: { damping: 200 },
              });
              return (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transform: `translateY(${interpolate(itemProgress, [0, 1], [20, 0])}px)`,
                    opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      boxShadow: "0 0 8px #22c55e",
                    }}
                  />
                  <span style={{ color: "#888", fontSize: 22, fontWeight: 500 }}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
