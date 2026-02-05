import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Elegant title reveal with glow
const SolutionTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 30, mass: 0.8, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [30, 0]);
  const scale = interpolate(progress, [0, 0.8, 1], [0.9, 1.02, 1]);
  const letterSpacing = interpolate(progress, [0, 1], [20, 8]);

  // Subtle glow pulse after appear
  const glowPulse = frame > 20 ? Math.sin((frame - 20) * 0.06) * 0.3 + 0.7 : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        fontSize: 32,
        color: '#22c55e',
        textTransform: 'uppercase',
        letterSpacing,
        fontWeight: 600,
        marginBottom: 40,
        textShadow: `
          0 0 ${20 * glowPulse}px rgba(34,197,94,0.5),
          0 0 ${40 * glowPulse}px rgba(34,197,94,0.3)
        `,
      }}
    >
      The Solution
    </div>
  );
};

// Animated checkmark with smooth draw
const ElegantCheckmark: React.FC<{ size: number; delay: number }> = ({ size, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0, 1.15, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Circle glow pulse
  const glowFrame = frame - delay - 15;
  const glow = glowFrame > 0 ? Math.sin(glowFrame * 0.08) * 15 + 20 : 0;

  // Checkmark stroke animation
  const strokeProgress = interpolate(progress, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'rgba(34,197,94,0.15)',
        border: '3px solid rgba(34,197,94,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `
          0 0 ${glow}px rgba(34,197,94,0.4),
          0 0 ${glow * 2}px rgba(34,197,94,0.2),
          inset 0 0 30px rgba(34,197,94,0.1)
        `,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
        <path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="30"
          strokeDashoffset={30 - 30 * strokeProgress}
        />
      </svg>
    </div>
  );
};

// Smooth particle burst
const ParticleBurst: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const burstFrame = frame - delay;

  if (burstFrame < 0 || burstFrame > 50) return null;

  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const speed = 3 + (i % 3);
    const distance = burstFrame * speed;
    const opacity = interpolate(burstFrame, [0, 20, 50], [0.8, 0.5, 0]);
    const size = 6 + (i % 4) * 2;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y, size, opacity };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            transform: `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px)`,
            opacity: p.opacity,
            boxShadow: '0 0 10px rgba(34,197,94,0.8)',
          }}
        />
      ))}
    </>
  );
};

// Floating light orbs
const FloatingOrbs: React.FC = () => {
  const frame = useCurrentFrame();

  const orbs = [
    { x: 200, y: 250, size: 150, speed: 0.02, delay: 0 },
    { x: 1700, y: 350, size: 120, speed: 0.025, delay: 10 },
    { x: 250, y: 750, size: 100, speed: 0.018, delay: 20 },
    { x: 1650, y: 800, size: 130, speed: 0.022, delay: 5 },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const floatY = Math.sin((frame + orb.delay) * orb.speed) * 25;
        const floatX = Math.cos((frame + orb.delay) * orb.speed * 0.7) * 15;
        const pulse = Math.sin((frame + orb.delay) * 0.05) * 0.2 + 0.8;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x + floatX - orb.size / 2,
              top: orb.y + floatY - orb.size / 2,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(34,197,94,${0.15 * pulse}) 0%, transparent 70%)`,
              filter: `blur(${orb.size * 0.15}px)`,
            }}
          />
        );
      })}
    </>
  );
};

// Subtle expanding rings
const SuccessRings: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [0, 30, 60];

  return (
    <>
      {rings.map((delay, i) => {
        const progress = ((frame + delay) % 90) / 90;
        const scale = interpolate(progress, [0, 1], [0.5, 2]);
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.2, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 - 100,
              top: 350 - 100,
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: '2px solid rgba(34,197,94,0.4)',
              transform: `scale(${scale})`,
              opacity,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

// Animated main text with word-by-word reveal
const MainMessage: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = "Schedule WhatsApp messages in seconds".split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
      {words.map((word, i) => {
        const wordProgress = spring({
          frame: frame - delay - i * 4,
          fps,
          config: { damping: 25, mass: 0.6, stiffness: 120 },
        });

        const opacity = interpolate(wordProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const y = interpolate(wordProgress, [0, 1], [30, 0]);
        const scale = interpolate(wordProgress, [0, 0.8, 1], [0.8, 1.03, 1]);
        const blur = interpolate(wordProgress, [0, 0.5], [8, 0], { extrapolateRight: 'clamp' });

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              filter: `blur(${blur}px)`,
              fontSize: 56,
              fontWeight: 700,
              color: '#fff',
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Smooth pill badges
const FeaturePills: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pills = ["offline", "asleep", "on a plane"];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 25, marginTop: 20 }}>
      {pills.map((pill, i) => {
        const progress = spring({
          frame: frame - delay - i * 8,
          fps,
          config: { damping: 20, mass: 0.5, stiffness: 100 },
        });

        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const scale = interpolate(progress, [0, 0.8, 1], [0.5, 1.05, 1]);
        const y = interpolate(progress, [0, 1], [20, 0]);

        // Subtle hover effect after appear
        const hoverFrame = frame - delay - i * 8 - 20;
        const hover = hoverFrame > 0 ? Math.sin(hoverFrame * 0.08 + i) * 3 : 0;

        // Glow pulse
        const glow = hoverFrame > 0 ? Math.sin(hoverFrame * 0.1 + i) * 0.3 + 0.7 : 0;

        return (
          <div
            key={pill}
            style={{
              opacity,
              transform: `translateY(${y + hover}px) scale(${scale})`,
              padding: '14px 32px',
              backgroundColor: 'rgba(34,197,94,0.12)',
              borderRadius: 40,
              border: '1px solid rgba(34,197,94,0.35)',
              boxShadow: `0 0 ${20 * glow}px rgba(34,197,94,0.2)`,
            }}
          >
            <span style={{ color: '#22c55e', fontSize: 32, fontWeight: 600 }}>
              {pill}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Secondary message
const SecondaryMessage: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, mass: 0.6, stiffness: 80 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [25, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: 'center',
        marginTop: 35,
      }}
    >
      <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
        Messages send at the exact time, even if you're
      </span>
    </div>
  );
};

// Subtle gradient line
const GradientLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 200 * progress,
        height: 3,
        background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
        borderRadius: 2,
        marginTop: 30,
        marginBottom: 30,
        opacity: 0.6,
      }}
    />
  );
};

export const SolutionScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <AnimatedBackground variant="gradient" />

      {/* Floating light orbs */}
      <FloatingOrbs />

      {/* Success rings behind checkmark */}
      <SuccessRings />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 1400,
          }}
        >
          {/* The Solution title */}
          <SolutionTitle />

          {/* Animated checkmark with particle burst */}
          <div style={{ position: 'relative', marginBottom: 40 }}>
            <ElegantCheckmark size={100} delay={10} />
            <ParticleBurst delay={20} />
          </div>

          {/* Main message */}
          <MainMessage delay={20} />

          {/* Gradient divider */}
          <GradientLine delay={45} />

          {/* Secondary message */}
          <SecondaryMessage delay={50} />

          {/* Feature pills */}
          <FeaturePills delay={60} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
