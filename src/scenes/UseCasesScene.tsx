import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Animated Calendar Icon
const CalendarIcon: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  // Page flip animation
  const flipProgress = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.15) * 0.1 : 0;

  // Checkmark appears
  const checkProgress = spring({
    frame: frame - delay - 25,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 150 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Calendar body */}
      <rect
        x="6"
        y="10"
        width="28"
        height="26"
        rx="4"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        opacity={progress}
      />
      {/* Calendar top bar */}
      <rect
        x="6"
        y="10"
        width="28"
        height="8"
        rx="4"
        fill="#22c55e"
        opacity={progress * 0.3}
      />
      {/* Binding rings */}
      <line x1="14" y1="6" x2="14" y2="14" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" opacity={progress} />
      <line x1="26" y1="6" x2="26" y2="14" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" opacity={progress} />
      {/* Date grid dots */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={14 + col * 6}
            cy={22 + row * 5}
            r={1.5}
            fill="#22c55e"
            opacity={progress * 0.5}
            transform={`translate(0, ${flipProgress * (row + 1) * 2})`}
          />
        ))
      )}
      {/* Animated checkmark */}
      <path
        d="M15 27l4 4 8-8"
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

// Animated Target Icon
const TargetIcon: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  // Pulsing rings
  const pulsePhase = (frame - delay) * 0.1;
  const pulse1 = Math.sin(pulsePhase) * 0.1 + 1;
  const pulse2 = Math.sin(pulsePhase + 1) * 0.1 + 1;
  const pulse3 = Math.sin(pulsePhase + 2) * 0.1 + 1;

  // Arrow flies in
  const arrowProgress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 10, mass: 0.3, stiffness: 200 },
  });
  const arrowX = interpolate(arrowProgress, [0, 1], [15, 0]);
  const arrowRotate = interpolate(arrowProgress, [0, 1], [20, 0]);

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Outer ring */}
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        opacity={progress * 0.4}
        transform={`scale(${pulse1})`}
        style={{ transformOrigin: '20px 20px' }}
      />
      {/* Middle ring */}
      <circle
        cx="20"
        cy="20"
        r="11"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        opacity={progress * 0.6}
        transform={`scale(${pulse2})`}
        style={{ transformOrigin: '20px 20px' }}
      />
      {/* Inner ring */}
      <circle
        cx="20"
        cy="20"
        r="6"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        opacity={progress * 0.8}
        transform={`scale(${pulse3})`}
        style={{ transformOrigin: '20px 20px' }}
      />
      {/* Center dot */}
      <circle cx="20" cy="20" r="2.5" fill="#22c55e" opacity={progress} />
      {/* Arrow/dart */}
      <g transform={`translate(${arrowX}, ${-arrowX * 0.5}) rotate(${arrowRotate}, 20, 20)`} opacity={arrowProgress}>
        <line x1="28" y1="12" x2="20" y2="20" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 8l4 4-2 2" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// Animated Gift/Celebration Icon
const GiftIcon: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  // Lid bounce
  const lidBounce = frame > delay + 25 ? Math.sin((frame - delay - 25) * 0.2) * 2 : 0;

  // Confetti particles
  const confettiProgress = interpolate(frame - delay - 30, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const confetti = [
    { x: -8, y: -15, color: '#22c55e' },
    { x: 8, y: -18, color: '#4ade80' },
    { x: 0, y: -20, color: '#86efac' },
    { x: -5, y: -12, color: '#22c55e' },
    { x: 5, y: -14, color: '#4ade80' },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Gift box body */}
      <rect
        x="8"
        y="18"
        width="24"
        height="16"
        rx="2"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        opacity={progress}
      />
      {/* Vertical ribbon */}
      <line x1="20" y1="18" x2="20" y2="34" stroke="#22c55e" strokeWidth="2.5" opacity={progress * 0.6} />
      {/* Gift lid */}
      <rect
        x="6"
        y={12 - lidBounce}
        width="28"
        height="6"
        rx="2"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        opacity={progress}
      />
      {/* Bow */}
      <circle cx="20" cy={10 - lidBounce} r="4" fill="#22c55e" opacity={progress * 0.4} />
      <path
        d={`M16 ${10 - lidBounce} Q20 ${6 - lidBounce} 24 ${10 - lidBounce}`}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        opacity={progress}
      />
      {/* Confetti */}
      {confetti.map((c, i) => {
        const y = c.y * confettiProgress + 10;
        const opacity = interpolate(confettiProgress, [0, 0.3, 1], [0, 1, 0]);
        const rotation = confettiProgress * 360 * (i % 2 === 0 ? 1 : -1);
        return (
          <rect
            key={i}
            x={20 + c.x - 2}
            y={y}
            width="4"
            height="4"
            fill={c.color}
            opacity={opacity}
            transform={`rotate(${rotation}, ${20 + c.x}, ${y + 2})`}
          />
        );
      })}
    </svg>
  );
};

// Animated Dollar Icon
const DollarIcon: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  // Coin shine sweep
  const shineProgress = ((frame - delay) % 60) / 60;
  const shineX = interpolate(shineProgress, [0, 1], [-20, 60]);

  // Floating coins animation
  const float = Math.sin((frame - delay) * 0.08) * 2;

  // Dollar sign draw
  const dollarDraw = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 150 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <clipPath id="coinClip">
          <circle cx="20" cy="20" r="15" />
        </clipPath>
      </defs>
      {/* Main coin circle */}
      <circle
        cx="20"
        cy={20 + float}
        r="15"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        opacity={progress}
      />
      {/* Inner circle */}
      <circle
        cx="20"
        cy={20 + float}
        r="11"
        fill="rgba(34,197,94,0.15)"
        stroke="#22c55e"
        strokeWidth="1.5"
        opacity={progress * 0.6}
      />
      {/* Dollar sign */}
      <text
        x="20"
        y={25 + float}
        textAnchor="middle"
        fill="#22c55e"
        fontSize="16"
        fontWeight="bold"
        opacity={dollarDraw}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        $
      </text>
      {/* Vertical line through dollar */}
      <line
        x1="20"
        y1={12 + float}
        x2="20"
        y2={28 + float}
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeDasharray="20"
        strokeDashoffset={20 - 20 * dollarDraw}
        opacity={0.5}
      />
      {/* Shine effect */}
      <rect
        x={shineX}
        y="5"
        width="8"
        height="30"
        fill="url(#shineGradient)"
        clipPath="url(#coinClip)"
        opacity={progress * 0.4}
        style={{ transform: `rotate(-20deg)`, transformOrigin: '20px 20px' }}
      />
      <defs>
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#fff" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Animated Refresh/Sync Icon
const RefreshIcon: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  // Continuous rotation after appear
  const rotateProgress = frame > delay + 20 ? (frame - delay - 20) * 3 : 0;

  // Arrow head scale
  const arrowScale = spring({
    frame: frame - delay - 15,
    fps,
    config: { damping: 10, mass: 0.3, stiffness: 180 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <g style={{ transform: `rotate(${rotateProgress}deg)`, transformOrigin: '20px 20px' }}>
        {/* Top arc */}
        <path
          d="M30 14 A12 12 0 0 0 10 14"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset={40 - 40 * progress}
        />
        {/* Bottom arc */}
        <path
          d="M10 26 A12 12 0 0 0 30 26"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset={40 - 40 * progress}
        />
        {/* Top arrow */}
        <path
          d="M30 14l-4-4M30 14l-4 4"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrowScale}
          transform={`scale(${arrowScale})`}
          style={{ transformOrigin: '30px 14px' }}
        />
        {/* Bottom arrow */}
        <path
          d="M10 26l4-4M10 26l4 4"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrowScale}
          transform={`scale(${arrowScale})`}
          style={{ transformOrigin: '10px 26px' }}
        />
      </g>
    </svg>
  );
};

// Floating particles background
const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 103) % 1920;
    const y = (i * 67) % 1080;
    const speed = 0.015 + (i % 5) * 0.005;
    const floatX = Math.sin(frame * speed + i) * 50;
    const floatY = Math.cos(frame * speed * 0.8 + i * 0.5) * 40;
    const size = 4 + (i % 5) * 1.5;
    const opacity = 0.12 + (i % 4) * 0.06;

    return { x: x + floatX, y: y + floatY, size, opacity };
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
            backgroundColor: '#22c55e',
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
};

// Use case card with animated icon
const UseCaseCard: React.FC<{
  text: string;
  icon: React.ReactNode;
  delay: number;
  index: number;
}> = ({ text, icon, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth spring entrance
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.6, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const x = interpolate(progress, [0, 1], [60, 0]);
  const scale = interpolate(progress, [0, 0.8, 1], [0.85, 1.02, 1]);
  const blur = interpolate(progress, [0, 0.5], [8, 0], { extrapolateRight: 'clamp' });

  // Subtle continuous float after appear
  const floatY = frame > delay + 30 ? Math.sin((frame - delay) * 0.06 + index * 0.5) * 2 : 0;

  // Glow pulse
  const glowIntensity = frame > delay + 30 ? Math.sin((frame - delay) * 0.08 + index) * 0.3 + 0.7 : 0;

  // Line draw animation
  const lineProgress = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 25, mass: 0.5, stiffness: 120 },
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 60]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px) translateY(${floatY}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "18px 0",
      }}
    >
      {/* Animated line connector */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, rgba(34,197,94,0.8), transparent)",
          borderRadius: 2,
        }}
      />

      {/* Icon container with glow */}
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 20,
          background: "rgba(34,197,94,0.08)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `
            0 0 ${30 * glowIntensity}px rgba(34,197,94,0.25),
            inset 0 0 25px rgba(34,197,94,0.05)
          `,
          border: "1.5px solid rgba(34,197,94,0.3)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text with better typography */}
      <span
        style={{
          fontSize: 38,
          fontWeight: 500,
          color: "#fff",
          letterSpacing: "-0.3px",
          lineHeight: 1.2,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Animated counter
const AnimatedCounter: React.FC<{ delay: number; target: number }> = ({ delay, target }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 50, mass: 1.5, stiffness: 30 },
  });

  const count = Math.round(progress * target);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1]);

  // Subtle pulse after count complete
  const pulse = progress > 0.9 ? Math.sin((frame - delay) * 0.1) * 0.02 + 1 : 1;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale * pulse})`,
        display: "flex",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 90,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-4px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}+
      </span>
      <span
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        common uses
      </span>
    </div>
  );
};

// Title section
const TitleSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered reveals
  const labelProgress = spring({
    frame,
    fps,
    config: { damping: 25, mass: 0.6, stiffness: 100 },
  });

  const titleProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 25, mass: 0.6, stiffness: 100 },
  });

  const subtitleProgress = spring({
    frame: frame - 16,
    fps,
    config: { damping: 25, mass: 0.6, stiffness: 100 },
  });

  const labelOpacity = interpolate(labelProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const labelY = interpolate(labelProgress, [0, 1], [20, 0]);

  const titleOpacity = interpolate(titleProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);

  const subtitleOpacity = interpolate(subtitleProgress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  return (
    <div>
      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontSize: 24,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: 6,
          marginBottom: 28,
          fontWeight: 600,
        }}
      >
        Use Cases
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 86,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.05,
          letterSpacing: "-3px",
        }}
      >
        Perfect
      </div>

      {/* Subtitle with gradient */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 86,
          fontWeight: 800,
          background: "linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.05,
          letterSpacing: "-3px",
        }}
      >
        for...
      </div>

      {/* Counter - fixed height to prevent layout shift */}
      <div style={{ marginTop: 60, height: 100 }}>
        <AnimatedCounter delay={80} target={20} />
      </div>
    </div>
  );
};

// Glowing orbs background
const GlowingOrbs: React.FC = () => {
  const frame = useCurrentFrame();

  const orbs = [
    { x: 1650, y: 180, size: 280 },
    { x: 120, y: 850, size: 250 },
    { x: 1750, y: 700, size: 180 },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const float = Math.sin(frame * 0.02 + i) * 20;
        const pulse = Math.sin(frame * 0.04 + i * 2) * 0.2 + 0.8;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x - orb.size / 2,
              top: orb.y - orb.size / 2 + float,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(34,197,94,${0.15 * pulse}) 0%, transparent 70%)`,
              filter: `blur(${orb.size * 0.12}px)`,
            }}
          />
        );
      })}
    </>
  );
};

export const UseCasesScene: React.FC = () => {
  const useCases = [
    { text: "Appointment reminders", Icon: CalendarIcon, delay: 25 },
    { text: "Follow-up at the perfect time", Icon: TargetIcon, delay: 38 },
    { text: "Birthday & event messages", Icon: GiftIcon, delay: 51 },
    { text: "Invoice reminders", Icon: DollarIcon, delay: 64 },
    { text: "Win back quiet clients", Icon: RefreshIcon, delay: 77 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <AnimatedBackground variant="default" />

      {/* Background elements */}
      <FloatingParticles />
      <GlowingOrbs />

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
            gap: 120,
            alignItems: "center",
          }}
        >
          {/* Left side - Title */}
          <TitleSection />

          {/* Right side - Use case list */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={useCase.text}
                text={useCase.text}
                icon={<useCase.Icon delay={useCase.delay} size={42} />}
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
