import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Smooth easing functions
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Ambient floating particles
const AmbientParticles: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 40 }, (_, i) => {
    const baseX = (i * 137) % 1920;
    const baseY = (i * 89) % 1080;
    const speed = 0.008 + (i % 5) * 0.004;
    const size = 2 + (i % 4);
    const x = baseX + Math.sin(frame * speed + i * 0.7) * 60;
    const y = baseY + Math.cos(frame * speed * 0.8 + i * 0.5) * 40;
    const opacity = 0.15 + Math.sin(frame * 0.03 + i * 0.5) * 0.1;

    return { x, y, size, opacity };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: i % 3 === 0 ? "#22c55e" : "#fff",
            opacity: p.opacity * (i % 3 === 0 ? 0.6 : 0.3),
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};

// Flowing connection lines between cards
const ConnectionLines: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();

  // Animated dash offset for flowing effect
  const dashOffset = frame * 2;

  return (
    <svg
      width="1920"
      height="1080"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal line between top cards */}
      <line
        x1="720"
        y1="420"
        x2="1200"
        y2="420"
        stroke="url(#lineGrad1)"
        strokeWidth="2"
        strokeDasharray="8 12"
        strokeDashoffset={dashOffset}
        opacity={interpolate(progress, [0.3, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* Horizontal line between bottom cards */}
      <line
        x1="720"
        y1="620"
        x2="1200"
        y2="620"
        stroke="url(#lineGrad1)"
        strokeWidth="2"
        strokeDasharray="8 12"
        strokeDashoffset={-dashOffset}
        opacity={interpolate(progress, [0.5, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* Vertical lines */}
      <line
        x1="600"
        y1="470"
        x2="600"
        y2="570"
        stroke="url(#lineGrad2)"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeDashoffset={dashOffset * 0.8}
        opacity={interpolate(progress, [0.4, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <line
        x1="1320"
        y1="470"
        x2="1320"
        y2="570"
        stroke="url(#lineGrad2)"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeDashoffset={-dashOffset * 0.8}
        opacity={interpolate(progress, [0.5, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </svg>
  );
};

// Animated title with letter-by-letter reveal
const AnimatedTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = "Key Features";
  const letters = title.split("");

  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {letters.map((letter, i) => {
          const letterProgress = spring({
            frame: frame - i * 2,
            fps,
            config: { damping: 15, mass: 0.5, stiffness: 120 },
          });

          const y = interpolate(letterProgress, [0, 1], [60, 0]);
          const opacity = interpolate(letterProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          const scale = interpolate(letterProgress, [0, 0.7, 1], [0.5, 1.1, 1]);
          const rotateX = interpolate(letterProgress, [0, 1], [90, 0]);

          // Shimmer effect after letter appears
          const shimmer = letterProgress > 0.9
            ? Math.sin((frame - i * 2) * 0.15) * 0.3 + 0.7
            : 1;

          return (
            <span
              key={i}
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#fff",
                display: "inline-block",
                transform: `translateY(${y}px) scale(${scale}) perspective(500px) rotateX(${rotateX}deg)`,
                opacity,
                textShadow: `0 0 ${30 * shimmer}px rgba(34,197,94,${0.5 * shimmer}), 0 0 60px rgba(34,197,94,0.2)`,
                marginRight: letter === " " ? 20 : 2,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Animated underline */}
      <div
        style={{
          position: "absolute",
          bottom: -15,
          left: "50%",
          transform: "translateX(-50%)",
          height: 4,
          width: interpolate(
            spring({ frame: frame - 25, fps, config: { damping: 20, stiffness: 80 } }),
            [0, 1],
            [0, 350]
          ),
          background: "linear-gradient(90deg, transparent, #22c55e, #22c55e, transparent)",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(34,197,94,0.5)",
        }}
      />
    </div>
  );
};

// Premium animated icon - Clock with smooth hands
const ClockIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const drawProgress = interpolate(progress, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
  const handRotation = interpolate(progress, [0.3, 1], [0, 360], { extrapolateLeft: "clamp" });
  const minuteRotation = handRotation * 0.08;

  // Subtle pulse
  const pulse = progress > 0.8 ? Math.sin(frame * 0.1) * 0.05 + 1 : 1;

  return (
    <svg width="50" height="50" viewBox="0 0 24 24" style={{ transform: `scale(${pulse})` }}>
      {/* Outer glow ring */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="none"
        stroke="rgba(34,197,94,0.2)"
        strokeWidth="1"
        opacity={drawProgress}
      />
      {/* Main circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="57"
        strokeDashoffset={57 - 57 * drawProgress}
        strokeLinecap="round"
      />
      {/* Hour markers */}
      {[0, 90, 180, 270].map((angle, i) => (
        <circle
          key={i}
          cx={12 + Math.cos((angle - 90) * Math.PI / 180) * 7}
          cy={12 + Math.sin((angle - 90) * Math.PI / 180) * 7}
          r="1"
          fill="#22c55e"
          opacity={interpolate(drawProgress, [0.5 + i * 0.1, 0.6 + i * 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ))}
      {/* Hour hand */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="7"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${handRotation}, 12, 12)`}
        opacity={drawProgress}
      />
      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="5"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform={`rotate(${minuteRotation}, 12, 12)`}
        opacity={drawProgress}
      />
      {/* Center dot */}
      <circle cx="12" cy="12" r="2" fill="#22c55e" opacity={drawProgress} />
    </svg>
  );
};

// Premium animated icon - Users with connection
const UsersIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const person1 = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const person2 = interpolate(progress, [0.2, 0.6], [0, 1], { extrapolateRight: "clamp" });
  const person3 = interpolate(progress, [0.4, 0.8], [0, 1], { extrapolateRight: "clamp" });
  const connectionLine = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" });

  // Subtle breathing animation
  const breathe = progress > 0.8 ? Math.sin(frame * 0.08) * 2 : 0;

  return (
    <svg width="50" height="50" viewBox="0 0 24 24">
      {/* Connection arc */}
      <path
        d="M 6 16 Q 12 12 18 16"
        fill="none"
        stroke="rgba(34,197,94,0.4)"
        strokeWidth="1"
        strokeDasharray="30"
        strokeDashoffset={30 - 30 * connectionLine}
      />

      {/* Person 1 (left) */}
      <g opacity={person1} transform={`translate(0, ${-breathe * 0.3})`}>
        <circle cx="6" cy="8" r="3" fill="none" stroke="#22c55e" strokeWidth="2" />
        <path d="M2 18v-1a4 4 0 014-4" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Person 2 (center - main) */}
      <g opacity={person2} transform={`translate(0, ${-breathe * 0.5})`}>
        <circle cx="12" cy="7" r="3.5" fill="none" stroke="#22c55e" strokeWidth="2" />
        <path d="M7 18v-2a5 5 0 0110 0v2" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Person 3 (right) */}
      <g opacity={person3} transform={`translate(0, ${-breathe * 0.3})`}>
        <circle cx="18" cy="8" r="3" fill="none" stroke="#22c55e" strokeWidth="2" />
        <path d="M22 18v-1a4 4 0 00-4-4" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// Premium animated icon - Smart checkmark with particles
const CheckIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const circleProgress = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const checkProgress = interpolate(progress, [0.4, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const particleBurst = interpolate(progress, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" });

  // Success pulse
  const successPulse = progress > 0.8 ? Math.sin(frame * 0.12) * 0.08 + 1 : 1;

  return (
    <svg width="50" height="50" viewBox="0 0 24 24" style={{ transform: `scale(${successPulse})` }}>
      {/* Success particles */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const distance = 8 + particleBurst * 6;
        const x = 12 + Math.cos(angle * Math.PI / 180) * distance;
        const y = 12 + Math.sin(angle * Math.PI / 180) * distance;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.5 - particleBurst * 0.5}
            fill="#22c55e"
            opacity={(1 - particleBurst) * 0.8}
          />
        );
      })}

      {/* Outer glow */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="rgba(34,197,94,0.3)"
        strokeWidth="1"
        opacity={circleProgress}
      />

      {/* Main circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="rgba(34,197,94,0.1)"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="57"
        strokeDashoffset={57 - 57 * circleProgress}
      />

      {/* Checkmark */}
      <path
        d="M7 12.5l3 3 7-7"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20"
        strokeDashoffset={20 - 20 * checkProgress}
      />
    </svg>
  );
};

// Premium animated icon - Device with screen content
const DeviceIcon: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const deviceDraw = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const screenContent = interpolate(progress, [0.4, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle tilt animation
  const tilt = progress > 0.8 ? Math.sin(frame * 0.06) * 3 : 0;

  return (
    <svg width="50" height="50" viewBox="0 0 24 24" style={{ transform: `rotate(${tilt}deg)` }}>
      {/* Phone outline */}
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        fill="rgba(34,197,94,0.05)"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="68"
        strokeDashoffset={68 - 68 * deviceDraw}
      />

      {/* Screen content - message bubbles */}
      <rect
        x="7"
        y="5"
        width="7"
        height="3"
        rx="1.5"
        fill="#22c55e"
        opacity={screenContent * 0.6}
      />
      <rect
        x="10"
        y="9"
        width="7"
        height="3"
        rx="1.5"
        fill="#22c55e"
        opacity={interpolate(screenContent, [0.3, 1], [0, 0.4], { extrapolateLeft: "clamp" })}
      />
      <rect
        x="7"
        y="13"
        width="5"
        height="3"
        rx="1.5"
        fill="#22c55e"
        opacity={interpolate(screenContent, [0.6, 1], [0, 0.5], { extrapolateLeft: "clamp" })}
      />

      {/* Home button */}
      <circle
        cx="12"
        cy="19"
        r="1.5"
        fill="#22c55e"
        opacity={deviceDraw}
      />
    </svg>
  );
};

// Premium feature card with glassmorphism
const FeatureCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  delay: number;
  index: number;
  direction: "left" | "right";
}> = ({ title, icon, delay, index, direction }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  // Slide in from left or right
  const startX = direction === "left" ? -400 : 400;
  const x = interpolate(progress, [0, 1], [startX, 0], { easing: easeOutExpo });
  const y = interpolate(progress, [0, 0.8, 1], [30, -5, 0]);
  const scale = interpolate(progress, [0, 0.9, 1], [0.8, 1.02, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const rotate = interpolate(progress, [0, 1], [direction === "left" ? -8 : 8, 0]);

  // Continuous subtle animations after appear
  const floatY = progress > 0.9 ? Math.sin((frame - delay) * 0.04 + index) * 4 : 0;
  const glowPulse = progress > 0.9 ? Math.sin((frame - delay) * 0.06 + index * 0.5) * 0.4 + 0.6 : 0;

  // Animated border gradient
  const borderAngle = ((frame - delay) * 1.5) % 360;

  // Word-by-word text animation
  const words = title.split(" ");

  return (
    <div
      style={{
        transform: `translateX(${x}px) translateY(${y + floatY}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        position: "relative",
      }}
    >
      {/* Glow effect behind card */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          background: `radial-gradient(ellipse at center, rgba(34,197,94,${0.15 * glowPulse}) 0%, transparent 70%)`,
          borderRadius: 40,
          filter: "blur(20px)",
        }}
      />

      {/* Animated border */}
      <div
        style={{
          position: "relative",
          padding: 2,
          borderRadius: 24,
          background: `linear-gradient(${borderAngle}deg,
            rgba(34,197,94,0.6),
            rgba(34,197,94,0.1),
            rgba(34,197,94,0.3),
            rgba(34,197,94,0.1),
            rgba(34,197,94,0.6)
          )`,
        }}
      >
        {/* Card content */}
        <div
          style={{
            backgroundColor: "rgba(10,10,10,0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: 22,
            padding: "32px 40px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            minWidth: 420,
          }}
        >
          {/* Icon container */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 ${25 * glowPulse}px rgba(34,197,94,0.3), inset 0 0 20px rgba(34,197,94,0.1)`,
              border: "1px solid rgba(34,197,94,0.2)",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          {/* Text with word animation */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {words.map((word, i) => {
              const wordProgress = spring({
                frame: frame - delay - 10 - i * 4,
                fps,
                config: { damping: 20, mass: 0.5, stiffness: 100 },
              });

              const wordY = interpolate(wordProgress, [0, 1], [20, 0]);
              const wordOpacity = interpolate(wordProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

              return (
                <span
                  key={i}
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: 600,
                    transform: `translateY(${wordY}px)`,
                    opacity: wordOpacity,
                    display: "inline-block",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Subtle background glow orbs
const BackgroundGlows: React.FC = () => {
  const frame = useCurrentFrame();

  const glows = [
    { x: 200, y: 300, size: 400, speed: 0.015, color: "34,197,94" },
    { x: 1720, y: 250, size: 350, speed: 0.02, color: "34,197,94" },
    { x: 300, y: 800, size: 300, speed: 0.018, color: "34,197,94" },
    { x: 1650, y: 750, size: 350, speed: 0.012, color: "34,197,94" },
  ];

  return (
    <>
      {glows.map((glow, i) => {
        const floatX = Math.sin(frame * glow.speed + i) * 30;
        const floatY = Math.cos(frame * glow.speed * 0.8 + i * 0.5) * 25;
        const pulse = Math.sin(frame * 0.03 + i * 1.5) * 0.3 + 0.7;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: glow.x + floatX - glow.size / 2,
              top: glow.y + floatY - glow.size / 2,
              width: glow.size,
              height: glow.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${glow.color},${0.08 * pulse}) 0%, transparent 70%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallProgress = interpolate(frame, [0, 150], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    {
      title: "One-time or recurring",
      delay: 30,
      direction: "left" as const,
      Icon: ClockIcon,
    },
    {
      title: "Contacts, groups & channels",
      delay: 45,
      direction: "right" as const,
      Icon: UsersIcon,
    },
    {
      title: "Auto-cancel if they reply",
      delay: 60,
      direction: "left" as const,
      Icon: CheckIcon,
    },
    {
      title: "Works from any device",
      delay: 75,
      direction: "right" as const,
      Icon: DeviceIcon,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <AnimatedBackground variant="gradient" />

      {/* Background elements */}
      <BackgroundGlows />
      <AmbientParticles />
      <ConnectionLines progress={overallProgress} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
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
          {/* Animated title */}
          <AnimatedTitle />

          {/* Feature cards in 2x2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 35,
              marginTop: 30,
            }}
          >
            {features.map((feature, index) => {
              const iconProgress = spring({
                frame: frame - feature.delay,
                fps,
                config: { damping: 18, mass: 0.8, stiffness: 100 },
              });

              return (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  icon={<feature.Icon progress={iconProgress} frame={frame} />}
                  delay={feature.delay}
                  index={index}
                  direction={feature.direction}
                />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
