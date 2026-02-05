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
import { GlowingOrb, PulsingRing } from "../components/AnimatedShapes";

export const SchedulingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const modalScale = interpolate(modalProgress, [0, 1], [0.8, 1]);
  const modalOpacity = interpolate(modalProgress, [0, 0.5], [0, 1]);
  const modalY = interpolate(modalProgress, [0, 1], [50, 0]);

  // Floating effect
  const float = Math.sin(frame * 0.04) * 4;

  // Sequential highlight animations
  const highlightSequence = [
    { name: "contact", start: 35, end: 65 },
    { name: "message", start: 60, end: 90 },
    { name: "calendar", start: 85, end: 115 },
    { name: "time", start: 110, end: 145 },
  ];

  const getHighlightOpacity = (start: number, end: number) => {
    if (frame < start || frame > end + 15) return 0;
    if (frame < start + 10)
      return interpolate(frame, [start, start + 10], [0, 1]);
    if (frame > end) return interpolate(frame, [end, end + 15], [1, 0]);
    return 1;
  };

  // Cursor animation
  const cursorX = interpolate(frame, [40, 60, 85, 110], [200, 200, 600, 650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [40, 60, 85, 110], [150, 280, 250, 480], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorOpacity = interpolate(frame, [35, 40, 135, 145], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Click effect
  const clickFrame1 = frame > 58 && frame < 65;
  const clickFrame2 = frame > 108 && frame < 115;
  const isClicking = clickFrame1 || clickFrame2;

  const captionProgress = spring({
    frame: frame - 130,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />

      <GlowingOrb x={250} y={250} size={250} color="#3b82f6" delay={0} />
      <GlowingOrb x={1650} y={750} size={200} color="#8b5cf6" delay={15} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Modal container with 3D perspective */}
        <div
          style={{
            transform: `scale(${modalScale}) translateY(${modalY + float}px)`,
            opacity: modalOpacity,
            position: "relative",
            perspective: 1000,
          }}
        >
          {/* Glow behind modal */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 600,
              height: 600,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          {/* Modal screenshot */}
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: `
                0 50px 100px rgba(0,0,0,0.6),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `,
              position: "relative",
            }}
          >
            <Img
              src={staticFile("schedule-modal.png")}
              style={{
                width: 900,
                display: "block",
              }}
            />

            {/* Contact field highlight */}
            <div
              style={{
                position: "absolute",
                top: 164,
                left: 25,
                width: 460,
                height: 77,
                border: "2px solid #3b82f6",
                borderRadius: 12,
                opacity: getHighlightOpacity(35, 65),
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                background: "rgba(59, 130, 246, 0.05)",
              }}
            />

            {/* Message field highlight */}
            <div
              style={{
                position: "absolute",
                top: 245,
                left: 22,
                width: 460,
                height: 185,
                border: "2px solid #8b5cf6",
                borderRadius: 12,
                opacity: getHighlightOpacity(60, 90),
                boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)",
                background: "rgba(139, 92, 246, 0.05)",
              }}
            />

            {/* Calendar highlight */}
            <div
              style={{
                position: "absolute",
                top: 135,
                right: 25,
                width: 390,
                height: 320,
                border: "2px solid #22c55e",
                borderRadius: 12,
                opacity: getHighlightOpacity(85, 115),
                boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)",
                background: "rgba(34, 197, 94, 0.05)",
              }}
            />

            {/* Time picker highlight */}
            <div
              style={{
                position: "absolute",
                top: 462,
                left: 500,
                width: 180,
                height: 85,
                border: "2px solid #f59e0b",
                borderRadius: 12,
                opacity: getHighlightOpacity(110, 145),
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
                background: "rgba(245, 158, 11, 0.05)",
              }}
            />

            {/* Animated cursor */}
            <div
              style={{
                position: "absolute",
                left: cursorX,
                top: cursorY,
                opacity: cursorOpacity,
                transform: `scale(${isClicking ? 0.8 : 1})`,
                transition: "transform 0.1s",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M5 3l14 9-8 2-2 8z"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="1"
                />
              </svg>
              {isClicking && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    transform: "translate(-8px, -8px) scale(1.5)",
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div
            style={{
              position: "absolute",
              left: -80,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >
            {["1", "2", "3", "4"].map((num, i) => {
              const isActive = frame > highlightSequence[i].start;
              const stepProgress = spring({
                frame: frame - highlightSequence[i].start,
                fps,
                config: { damping: 200 },
              });
              return (
                <div
                  key={num}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: isActive
                      ? "#22c55e"
                      : "rgba(255,255,255,0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: isActive ? "#000" : "#666",
                    transform: `scale(${isActive ? stepProgress : 1})`,
                    boxShadow: isActive
                      ? "0 0 20px rgba(34,197,94,0.5)"
                      : "none",
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            opacity: interpolate(captionProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(captionProgress, [0, 1], [30, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 38, color: "#fff", fontWeight: 600 }}>
            Schedule in just a few clicks
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
