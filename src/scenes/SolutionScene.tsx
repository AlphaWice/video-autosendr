import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { PulsingRing, GlowingOrb } from "../components/AnimatedShapes";
import { AnimatedCheckmark } from "../components/AnimatedIcons";
import { AnimatedTitle, UnderlineReveal } from "../components/AnimatedText";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line2Progress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
  });

  const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1]);
  const line2Y = interpolate(line2Progress, [0, 1], [40, 0]);

  // Particle burst effect after checkmark
  const burstProgress = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />

      {/* Decorative glowing orbs */}
      <GlowingOrb x={300} y={300} size={200} color="#22c55e" delay={0} />
      <GlowingOrb x={1620} y={700} size={150} color="#22c55e" delay={10} />

      {/* Pulsing success ring */}
      <PulsingRing x={960} y={350} size={200} delay={30} />

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
            gap: 50,
            maxWidth: 1400,
          }}
        >
          {/* Animated checkmark with burst */}
          <div style={{ position: "relative" }}>
            <AnimatedCheckmark size={120} delay={0} />

            {/* Particle burst */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = burstProgress * 100;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const opacity = interpolate(burstProgress, [0, 0.5, 1], [0, 1, 0]);

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    transform: `translate(${x - 4}px, ${y - 4}px)`,
                    opacity,
                  }}
                />
              );
            })}
          </div>

          {/* Main message with animated title */}
          <AnimatedTitle
            text="Schedule WhatsApp messages in seconds"
            delay={15}
            fontSize={58}
            fontWeight={700}
          />

          {/* Secondary message */}
          <div
            style={{
              opacity: line2Opacity,
              transform: `translateY(${line2Y}px)`,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontSize: 38, color: "#999", fontWeight: 500 }}>
              Messages send at the exact time, even if you're
            </span>
            <br />
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 30 }}>
              {["offline", "asleep", "on a plane"].map((word, i) => {
                const wordProgress = spring({
                  frame: frame - 70 - i * 10,
                  fps,
                  config: { damping: 200 },
                });

                return (
                  <div
                    key={word}
                    style={{
                      padding: "12px 28px",
                      backgroundColor: "rgba(34,197,94,0.15)",
                      borderRadius: 30,
                      border: "1px solid rgba(34,197,94,0.3)",
                      transform: `scale(${wordProgress})`,
                    }}
                  >
                    <span style={{ color: "#22c55e", fontSize: 34, fontWeight: 600 }}>
                      {word}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
