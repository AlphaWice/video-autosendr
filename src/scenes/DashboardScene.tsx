import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { FloatingShapes, GlowingOrb } from "../components/AnimatedShapes";

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const browserScale = interpolate(browserProgress, [0, 1], [0.85, 1]);
  const browserY = interpolate(browserProgress, [0, 1], [80, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.3], [0, 1]);
  const browserRotateX = interpolate(browserProgress, [0, 1], [15, 0]);

  // Floating animation for the browser
  const float = Math.sin(frame * 0.03) * 5;

  // Scanning highlight effect
  const scanY = interpolate(frame, [60, 150], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [60, 70, 140, 150], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textProgress = spring({
    frame: frame - 80,
    fps,
    config: { damping: 200 },
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);

  // Stats highlight glow
  const highlightPulse = Math.sin((frame - 100) * 0.15) * 0.3 + 0.7;
  const showHighlight = frame > 90 && frame < 160;

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="grid" />

      {/* Decorative elements */}
      <GlowingOrb x={200} y={200} size={300} color="#fff" delay={0} />
      <GlowingOrb x={1700} y={800} size={250} color="#fff" delay={20} />
      <FloatingShapes />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          perspective: 1000,
        }}
      >
        {/* Browser mockup with 3D effect */}
        <div
          style={{
            transform: `scale(${browserScale}) translateY(${browserY + float}px) rotateX(${browserRotateX}deg)`,
            opacity: browserOpacity,
            width: 1400,
            backgroundColor: "#1a1a1a",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `
              0 50px 100px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.1),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Browser chrome with animated dots */}
          <div
            style={{
              height: 50,
              backgroundColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 10,
            }}
          >
            {[
              { color: "#ff5f57", delay: 0 },
              { color: "#febc2e", delay: 3 },
              { color: "#28c840", delay: 6 },
            ].map((dot, i) => {
              const dotScale = spring({
                frame: frame - 10 - dot.delay,
                fps,
                config: { damping: 15, stiffness: 200 },
              });
              return (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: dot.color,
                    transform: `scale(${dotScale})`,
                  }}
                />
              );
            })}

            {/* URL bar with typing effect */}
            <div
              style={{
                flex: 1,
                marginLeft: 20,
                height: 32,
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ color: "#22c55e", marginRight: 4 }}>●</span>
              app.autosendr.com
            </div>
          </div>

          {/* Dashboard screenshot with effects */}
          <div style={{ position: "relative" }}>
            <Img
              src={staticFile("dashboard.png")}
              style={{
                width: "100%",
                display: "block",
              }}
            />

            {/* Scanning line effect */}
            <div
              style={{
                position: "absolute",
                top: scanY,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #22c55e, transparent)",
                opacity: scanOpacity,
                boxShadow: "0 0 20px #22c55e",
              }}
            />

            {/* Highlight box on stats */}
            {showHighlight && (
              <div
                style={{
                  position: "absolute",
                  top: 130,
                  left: 240,
                  width: 560,
                  height: 90,
                  border: "2px solid #22c55e",
                  borderRadius: 16,
                  opacity: highlightPulse,
                  boxShadow: `0 0 30px rgba(34, 197, 94, ${highlightPulse * 0.5})`,
                  background: "rgba(34, 197, 94, 0.05)",
                }}
              />
            )}

            {/* Animated data points */}
            {[
              { x: 320, y: 145, delay: 100 },
              { x: 470, y: 145, delay: 110 },
              { x: 620, y: 145, delay: 120 },
              { x: 770, y: 145, delay: 130 },
            ].map((point, i) => {
              const pointProgress = spring({
                frame: frame - point.delay,
                fps,
                config: { damping: 15 },
              });
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    transform: `scale(${pointProgress})`,
                    boxShadow: "0 0 10px #22c55e",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 10px #22c55e",
            }}
          />
          <span style={{ fontSize: 38, color: "#fff", fontWeight: 600 }}>
            One dashboard to manage everything
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
