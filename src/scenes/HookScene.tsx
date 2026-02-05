import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Elegant floating particles
const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 25 }, (_, i) => {
    const baseX = (i * 83) % 1920;
    const baseY = (i * 47) % 1080;
    const speed = 0.015 + (i % 4) * 0.008;
    const x = baseX + Math.sin(frame * speed + i * 0.5) * 40;
    const y = baseY + Math.cos(frame * speed * 0.7 + i) * 30;
    const size = 3 + (i % 4) * 1.5;
    const opacity = 0.08 + Math.sin(frame * 0.04 + i) * 0.05;

    return { x, y, size, opacity };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#fff',
            opacity: p.opacity,
            boxShadow: '0 0 6px rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </>
  );
};

// Soft glowing orbs
const GlowingOrbs: React.FC = () => {
  const frame = useCurrentFrame();

  const orbs = [
    { x: 250, y: 300, size: 300, color: 'rgba(34,197,94,0.06)' },
    { x: 1650, y: 400, size: 350, color: 'rgba(34,197,94,0.03)' },
    { x: 300, y: 750, size: 250, color: 'rgba(34,197,94,0.05)' },
    { x: 1600, y: 800, size: 280, color: 'rgba(34,197,94,0.03)' },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const floatY = Math.sin(frame * 0.02 + i * 1.5) * 20;
        const floatX = Math.cos(frame * 0.015 + i) * 15;
        const pulse = Math.sin(frame * 0.03 + i * 2) * 0.15 + 0.85;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x + floatX - orb.size / 2,
              top: orb.y + floatY - orb.size / 2,
              width: orb.size * pulse,
              height: orb.size * pulse,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
        );
      })}
    </>
  );
};

// Elegant expanding rings
const ElegantRings: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [0, 25, 50];

  return (
    <>
      {rings.map((delay, i) => {
        const progress = ((frame + delay) % 80) / 80;
        const scale = interpolate(progress, [0, 1], [0.6, 2]);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.25, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 - 150,
              top: 400 - 150,
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.1)',
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Animated paper plane logo icon
const LogoIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, mass: 0.6, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0.3, 1.08, 1]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
  const rotate = interpolate(progress, [0, 1], [-15, 0]);

  // Stroke draw animation
  const strokeProgress = interpolate(progress, [0.1, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtle glow pulse after appear
  const glowPulse = frame > delay + 25 ? Math.sin((frame - delay - 25) * 0.08) * 10 + 15 : 0;

  // Gentle float
  const float = frame > delay + 30 ? Math.sin((frame - delay - 30) * 0.06) * 3 : 0;

  return (
    <div
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg) translateY(${float}px)`,
        opacity,
        filter: `drop-shadow(0 0 ${glowPulse}px rgba(255,255,255,0.5))`,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="hookLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <path
          d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
          stroke="url(#hookLogoGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="80"
          strokeDashoffset={80 - 80 * strokeProgress}
        />
      </svg>
    </div>
  );
};

// Animated logo text with smooth letter reveal
const LogoText: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "AutoSendr".split("");

  return (
    <div style={{ display: 'flex' }}>
      {letters.map((letter, i) => {
        const progress = spring({
          frame: frame - delay - i * 2.5,
          fps,
          config: { damping: 20, mass: 0.5, stiffness: 120 },
        });

        const y = interpolate(progress, [0, 1], [50, 0]);
        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const scale = interpolate(progress, [0, 0.8, 1], [0.7, 1.05, 1]);
        const blur = interpolate(progress, [0, 0.5], [10, 0], { extrapolateRight: 'clamp' });

        // Subtle glow after appear
        const glow = progress > 0.9 ? Math.sin((frame - delay - i * 2.5) * 0.08) * 3 + 8 : 0;

        return (
          <span
            key={i}
            style={{
              fontSize: 100,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-4px',
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
              textShadow: `0 0 ${glow + 20}px rgba(255,255,255,0.3)`,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

// Animated tagline with word-by-word reveal
const Tagline: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = "Automate your WhatsApp outreach".split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - delay - i * 5,
          fps,
          config: { damping: 22, mass: 0.5, stiffness: 100 },
        });

        const y = interpolate(progress, [0, 1], [35, 0]);
        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const scale = interpolate(progress, [0, 0.8, 1], [0.9, 1.02, 1]);
        const blur = interpolate(progress, [0, 0.4], [6, 0], { extrapolateRight: 'clamp' });

        // Highlight "WhatsApp" with green
        const isWhatsApp = word === "WhatsApp";

        return (
          <span
            key={i}
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: isWhatsApp ? '#22c55e' : 'rgba(255,255,255,0.9)',
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
              textShadow: isWhatsApp ? '0 0 20px rgba(34,197,94,0.4)' : 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Animated underline
const AnimatedUnderline: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 25, mass: 0.6, stiffness: 80 },
  });

  const width = interpolate(progress, [0, 1], [0, 450]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle shimmer
  const shimmerPos = ((frame - delay) % 60) / 60;
  const shimmerX = interpolate(shimmerPos, [0, 1], [-100, 550]);

  return (
    <div
      style={{
        position: 'relative',
        height: 4,
        width: width,
        overflow: 'hidden',
        borderRadius: 2,
        opacity,
      }}
    >
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(34,197,94,0.8), rgba(255,255,255,0.8), transparent)',
          borderRadius: 2,
        }}
      />
      {/* Shimmer */}
      <div
        style={{
          position: 'absolute',
          left: shimmerX,
          width: 80,
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }}
      />
    </div>
  );
};

// Subtle WhatsApp indicator
const WhatsAppIndicator: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.4, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0, 1.15, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  // Gentle pulse
  const pulse = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.1) * 0.05 + 1 : 1;

  // Float
  const float = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.08) * 4 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        right: 200,
        top: 200,
        transform: `scale(${scale * pulse}) translateY(${float}px)`,
        opacity: opacity * 0.6,
      }}
    >
      <svg width="60" height="60" viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          fill="rgba(34,197,94,0.2)"
          stroke="#22c55e"
          strokeWidth="1.5"
        />
        {/* Dots inside */}
        <circle cx="8" cy="10" r="1" fill="#22c55e" opacity="0.8" />
        <circle cx="12" cy="10" r="1" fill="#22c55e" opacity="0.8" />
        <circle cx="16" cy="10" r="1" fill="#22c55e" opacity="0.8" />
      </svg>
    </div>
  );
};

// Second message indicator
const MessageIndicator2: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.4, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0, 1.15, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  const float = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.09 + 1) * 5 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 180,
        bottom: 250,
        transform: `scale(${scale}) translateY(${float}px)`,
        opacity: opacity * 0.5,
      }}
    >
      <svg width="50" height="50" viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

// Clock/schedule indicator
const ScheduleIndicator: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.4, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0, 1.15, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  const float = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.07 + 2) * 4 : 0;

  // Clock hand rotation
  const handRotation = frame > delay + 20 ? (frame - delay - 20) * 2 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        right: 250,
        bottom: 280,
        transform: `scale(${scale}) translateY(${float}px)`,
        opacity: opacity * 0.5,
      }}
    >
      <svg width="45" height="45" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
        {/* Clock hands */}
        <line
          x1="12"
          y1="12"
          x2="12"
          y2="7"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${handRotation}, 12, 12)`}
        />
        <line
          x1="12"
          y1="12"
          x2="16"
          y2="12"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${handRotation * 0.08}, 12, 12)`}
        />
      </svg>
    </div>
  );
};

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      <AnimatedBackground variant="gradient" />

      {/* Background elements */}
      <GlowingOrbs />
      <FloatingParticles />
      <ElegantRings />

      {/* Decorative indicators */}
      <WhatsAppIndicator delay={30} />
      <MessageIndicator2 delay={40} />
      <ScheduleIndicator delay={50} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* Logo with icon and text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <LogoIcon delay={0} />
            <LogoText delay={3} />
          </div>

          {/* Tagline */}
          <Tagline delay={20} />

          {/* Animated underline */}
          <div style={{ marginTop: -15 }}>
            <AnimatedUnderline delay={45} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
