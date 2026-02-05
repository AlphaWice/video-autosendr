import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { FloatingShapes, GlowingOrb, PulsingRing } from "../components/AnimatedShapes";
import { AnimatedClock, AnimatedMessage, AnimatedRocket } from "../components/AnimatedIcons";

const AnimatedFeatureCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  delay: number;
  index: number;
}> = ({ title, icon, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [50, 0]);
  const rotate = interpolate(progress, [0, 1], [-5, 0]);

  // Hover-like pulse effect
  const glowIntensity = Math.sin((frame - delay) * 0.08) * 0.3 + 0.7;

  // Gradient border animation
  const gradientAngle = ((frame - delay) * 2) % 360;

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${y}px) rotate(${rotate}deg)`,
        opacity,
        position: "relative",
        padding: 2,
        borderRadius: 20,
        background: `linear-gradient(${gradientAngle}deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(255,255,255,0.2))`,
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          borderRadius: 18,
          padding: "35px 45px",
          display: "flex",
          alignItems: "center",
          gap: 25,
          boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 ${30 * glowIntensity}px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Icon container with glow */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 0 ${20 * glowIntensity}px rgba(34,197,94,0.2)`,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: 600,
            maxWidth: 300,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

// Animated icon components
const ClockIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = (frame - delay) * 4;
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `scale(${scale})` }}>
      <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" fill="none" />
      <line
        x1="12" y1="12" x2="12" y2="7"
        stroke="#22c55e" strokeWidth="2" strokeLinecap="round"
        transform={`rotate(${rotation}, 12, 12)`}
      />
      <line
        x1="12" y1="12" x2="16" y2="12"
        stroke="#22c55e" strokeWidth="2" strokeLinecap="round"
        transform={`rotate(${rotation * 0.08}, 12, 12)`}
      />
      <circle cx="12" cy="12" r="2" fill="#22c55e" />
    </svg>
  );
};

const UsersIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `scale(${progress})` }}>
      <circle cx="9" cy="7" r="4" stroke="#22c55e" strokeWidth="2" fill="none"
        strokeDasharray="25"
        strokeDashoffset={25 - 25 * progress}
      />
      <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#22c55e" strokeWidth="2" fill="none"
        strokeDasharray="35"
        strokeDashoffset={35 - 35 * progress}
      />
      <circle cx="19" cy="7" r="3" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.6"
        strokeDasharray="20"
        strokeDashoffset={20 - 20 * progress}
      />
      <path d="M22 21v-1.5a3 3 0 00-3-3" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.6"
        strokeDasharray="15"
        strokeDashoffset={15 - 15 * progress}
      />
    </svg>
  );
};

const CheckCircleIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const checkProgress = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <svg width="40" height="40" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" fill="none"
        strokeDasharray="63"
        strokeDashoffset={63 - 63 * progress}
      />
      <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="10"
        strokeDashoffset={10 - 10 * checkProgress}
      />
    </svg>
  );
};

const DevicesIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const bounce = Math.sin((frame - delay) * 0.15) * 2;

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `scale(${progress}) translateY(${bounce}px)` }}>
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="#22c55e" strokeWidth="2" fill="none" />
      <line x1="12" y1="18" x2="12" y2="18.01" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-40, 0]);
  const titleScale = interpolate(titleProgress, [0, 1], [0.9, 1]);

  const features = [
    { title: "One-time or recurring messages", icon: <ClockIcon delay={25} />, delay: 25 },
    { title: "Contacts, groups & channels", icon: <UsersIcon delay={40} />, delay: 40 },
    { title: "Auto-cancel if they reply", icon: <CheckCircleIcon delay={55} />, delay: 55 },
    { title: "Connect from any device", icon: <DevicesIcon delay={70} />, delay: 70 },
  ];

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />
      <FloatingShapes />

      {/* Decorative elements */}
      <GlowingOrb x={200} y={300} size={200} color="#22c55e" delay={0} />
      <GlowingOrb x={1720} y={700} size={180} color="#22c55e" delay={30} />
      <PulsingRing x={960} y={200} size={100} delay={0} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 60,
          }}
        >
          {/* Title with animated underline */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px) scale(${titleScale})`,
                fontSize: 56,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              Key Features
            </div>
            {/* Animated underline */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                height: 4,
                width: interpolate(
                  spring({ frame: frame - 15, fps, config: { damping: 200 } }),
                  [0, 1],
                  [0, 250]
                ),
                background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
                borderRadius: 2,
              }}
            />
          </div>

          {/* Feature cards in 2x2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 30,
            }}
          >
            {features.map((feature, index) => (
              <AnimatedFeatureCard
                key={feature.title}
                title={feature.title}
                icon={feature.icon}
                delay={feature.delay}
                index={index}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
