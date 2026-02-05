import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Epic 3D Lock that snaps shut
const EpicLock: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lock body appears
  const bodyProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 100 },
  });

  // Shackle snaps down with satisfying motion
  const shackleProgress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 8, mass: 0.4, stiffness: 200 },
  });

  // Shackle rotation (open to closed)
  const shackleRotation = interpolate(shackleProgress, [0, 1], [45, 0]);
  const shackleY = interpolate(shackleProgress, [0, 1], [-20, 0]);

  // Lock glow pulse after locked
  const isLocked = frame > delay + 35;
  const glowPulse = isLocked ? Math.sin((frame - delay - 35) * 0.1) * 0.4 + 0.6 : 0;

  // Keyhole glow
  const keyholeGlow = isLocked ? Math.sin((frame - delay - 35) * 0.15) * 10 + 15 : 0;

  // Scale bounce on lock
  const lockBounce = frame > delay + 30 && frame < delay + 45
    ? Math.sin((frame - delay - 30) * 0.5) * 0.05 * Math.exp(-(frame - delay - 30) * 0.1)
    : 0;

  return (
    <div style={{
      transform: `scale(${bodyProgress + lockBounce})`,
      filter: `drop-shadow(0 0 ${40 * glowPulse}px rgba(34,197,94,0.6))`,
    }}>
      <svg width="180" height="240" viewBox="0 0 60 80">
        {/* Lock body */}
        <rect
          x="10"
          y="35"
          width="40"
          height="35"
          rx="6"
          fill="rgba(34,197,94,0.15)"
          stroke="#22c55e"
          strokeWidth="3"
        />
        {/* Lock body inner gradient */}
        <rect
          x="14"
          y="39"
          width="32"
          height="27"
          rx="4"
          fill="rgba(34,197,94,0.1)"
        />
        {/* Keyhole */}
        <circle
          cx="30"
          cy="50"
          r="5"
          fill="#22c55e"
          style={{ filter: `drop-shadow(0 0 ${keyholeGlow}px #22c55e)` }}
        />
        <rect
          x="28"
          y="50"
          width="4"
          height="10"
          fill="#22c55e"
          style={{ filter: `drop-shadow(0 0 ${keyholeGlow}px #22c55e)` }}
        />
        {/* Shackle (animated) */}
        <g style={{
          transformOrigin: '30px 35px',
          transform: `rotate(${shackleRotation}deg) translateY(${shackleY}px)`,
        }}>
          <path
            d="M18 35 V20 A12 12 0 0 1 42 20 V35"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

// Hexagonal shield grid forming around lock
const HexShield: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexagons = [
    { x: 0, y: -120, delay: 0 },
    { x: 105, y: -60, delay: 3 },
    { x: 105, y: 60, delay: 6 },
    { x: 0, y: 120, delay: 9 },
    { x: -105, y: 60, delay: 12 },
    { x: -105, y: -60, delay: 15 },
  ];

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
      {hexagons.map((hex, i) => {
        const progress = spring({
          frame: frame - delay - hex.delay,
          fps,
          config: { damping: 12, mass: 0.4, stiffness: 150 },
        });

        const scale = interpolate(progress, [0, 0.8, 1], [0, 1.1, 1]);
        const opacity = interpolate(progress, [0, 0.5], [0, 0.6], { extrapolateRight: 'clamp' });
        const rotation = (frame - delay) * 0.3;

        // Pulse after appear
        const pulse = progress > 0.9 ? Math.sin((frame - delay) * 0.1 + i) * 0.1 + 1 : 1;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: hex.x - 45,
              top: hex.y - 52,
              transform: `scale(${scale * pulse}) rotate(${rotation}deg)`,
              opacity,
            }}
          >
            <svg width="90" height="105" viewBox="0 0 60 70">
              <polygon
                points="30,5 55,20 55,50 30,65 5,50 5,20"
                fill="rgba(34,197,94,0.08)"
                stroke="#22c55e"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// Digital encryption streams flowing into center
const EncryptionStreams: React.FC = () => {
  const frame = useCurrentFrame();

  const streams = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const startRadius = 500;
    const endRadius = 120;

    return { angle, startRadius, endRadius, offset: i * 6 };
  });

  return (
    <>
      {streams.map((stream, i) => {
        const streamFrame = (frame + stream.offset) % 60;
        const progress = streamFrame / 60;
        const radius = interpolate(progress, [0, 1], [stream.startRadius, stream.endRadius]);
        const x = Math.cos(stream.angle) * radius;
        const y = Math.sin(stream.angle) * radius;
        const opacity = interpolate(progress, [0, 0.3, 0.8, 1], [0, 0.8, 0.6, 0]);
        const size = interpolate(progress, [0, 1], [12, 4]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
              opacity,
              boxShadow: '0 0 10px #22c55e',
            }}
          />
        );
      })}
    </>
  );
};

// Orbiting lock icons
const OrbitingLocks: React.FC = () => {
  const frame = useCurrentFrame();

  const locks = [
    { radius: 280, speed: 0.015, size: 32, startAngle: 0 },
    { radius: 280, speed: 0.015, size: 32, startAngle: Math.PI },
    { radius: 350, speed: -0.012, size: 28, startAngle: Math.PI / 2 },
    { radius: 350, speed: -0.012, size: 28, startAngle: Math.PI * 1.5 },
  ];

  return (
    <>
      {locks.map((lock, i) => {
        const angle = lock.startAngle + frame * lock.speed;
        const x = Math.cos(angle) * lock.radius;
        const y = Math.sin(angle) * lock.radius;
        const opacity = Math.sin(frame * 0.05 + i) * 0.2 + 0.6;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(${x - lock.size / 2}px, ${y - lock.size / 2}px)`,
              opacity,
            }}
          >
            <svg width={lock.size} height={lock.size} viewBox="0 0 24 24">
              <rect x="4" y="11" width="16" height="10" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M8 11V7a4 4 0 018 0v4" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <circle cx="12" cy="15" r="1.5" fill="#22c55e" />
            </svg>
          </div>
        );
      })}
    </>
  );
};

// Binary/hex code rain
const CodeRain: React.FC = () => {
  const frame = useCurrentFrame();

  const columns = Array.from({ length: 30 }, (_, i) => {
    const x = (i / 30) * 1920;
    const speed = 3 + (i % 4);
    const chars = ['0', '1', 'A', 'F', 'E', '8', 'C', '2'];

    return { x, speed, char: chars[i % chars.length], offset: (i * 37) % 100 };
  });

  return (
    <>
      {columns.map((col, i) => {
        const y = ((frame * col.speed + col.offset * 10) % 1200) - 100;
        const opacity = 0.1 + (i % 3) * 0.05;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col.x,
              top: y,
              color: '#22c55e',
              fontSize: 14,
              fontFamily: 'monospace',
              opacity,
              textShadow: '0 0 5px #22c55e',
            }}
          >
            {col.char}
          </div>
        );
      })}
    </>
  );
};

// Security perimeter rings
const SecurityRings: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [
    { radius: 200, width: 2.5, speed: 0.02, opacity: 0.3 },
    { radius: 270, width: 2, speed: -0.015, opacity: 0.25 },
    { radius: 340, width: 1.5, speed: 0.01, opacity: 0.2 },
    { radius: 410, width: 1, speed: -0.008, opacity: 0.15 },
  ];

  return (
    <>
      {rings.map((ring, i) => {
        const rotation = frame * ring.speed * 50;
        const pulse = Math.sin(frame * 0.05 + i) * 0.15 + 0.85;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: ring.radius * 2,
              height: ring.radius * 2,
              marginLeft: -ring.radius,
              marginTop: -ring.radius,
              borderRadius: '50%',
              border: `${ring.width}px dashed rgba(34,197,94,${ring.opacity * pulse})`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

// Lock complete burst effect
const LockBurst: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const burstFrame = frame - delay;

  if (burstFrame < 0 || burstFrame > 40) return null;

  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const speed = 8 + (i % 4) * 3;
    const distance = burstFrame * speed;
    const opacity = interpolate(burstFrame, [0, 15, 40], [1, 0.6, 0]);
    const size = 6 + (i % 3) * 3;

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      opacity,
    };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            transform: `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px)`,
            opacity: p.opacity,
            boxShadow: '0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.5)',
          }}
        />
      ))}
    </>
  );
};

// Shockwave ring on lock
const LockShockwave: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const waveFrame = frame - delay;

  if (waveFrame < 0 || waveFrame > 50) return null;

  const scale = interpolate(waveFrame, [0, 50], [0.5, 5]);
  const opacity = interpolate(waveFrame, [0, 20, 50], [0.8, 0.4, 0]);
  const borderWidth = interpolate(waveFrame, [0, 50], [8, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 150,
        height: 150,
        marginLeft: -75,
        marginTop: -75,
        borderRadius: '50%',
        border: `${borderWidth}px solid rgba(34,197,94,${opacity})`,
        transform: `scale(${scale})`,
        boxShadow: `0 0 20px rgba(34,197,94,${opacity * 0.5})`,
      }}
    />
  );
};

// Main text with dramatic reveal
const PrivacyText: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "Your messages stay private."
  const line1Progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  // Line 2: "Even from us."
  const line2Progress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  const line1Opacity = interpolate(line1Progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const line1Y = interpolate(line1Progress, [0, 1], [40, 0]);
  const line1Blur = interpolate(line1Progress, [0, 0.5], [10, 0], { extrapolateRight: 'clamp' });

  const line2Opacity = interpolate(line2Progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const line2Y = interpolate(line2Progress, [0, 1], [30, 0]);
  const line2Scale = interpolate(line2Progress, [0, 0.8, 1], [0.9, 1.05, 1]);

  // Glow pulse on "Even from us"
  const textGlow = frame > delay + 40 ? Math.sin((frame - delay - 40) * 0.1) * 10 + 15 : 0;

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <div
        style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          filter: `blur(${line1Blur}px)`,
          fontSize: 68,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 20,
          letterSpacing: '-1px',
        }}
      >
        Your messages stay private.
      </div>
      <div
        style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px) scale(${line2Scale})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: '#22c55e',
            textShadow: `0 0 ${textGlow}px rgba(34,197,94,0.6)`,
          }}
        >
          Even from us.
        </span>
        {/* Animated verified badge */}
        <VerifiedBadge delay={delay + 35} />
      </div>
    </div>
  );
};

// Verified badge with animation
const VerifiedBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0, 1.2, 1]);
  const rotation = interpolate(progress, [0, 1], [-180, 0]);

  // Check draw
  const checkProgress = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 12, mass: 0.3, stiffness: 200 },
  });

  return (
    <div style={{
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      filter: 'drop-shadow(0 0 15px rgba(34,197,94,0.5))',
    }}>
      <svg width="56" height="56" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#22c55e" />
        <path
          d="M8 12l3 3 5-6"
          fill="none"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="15"
          strokeDashoffset={15 - 15 * checkProgress}
        />
      </svg>
    </div>
  );
};

// Trust badges that slam in
const TrustBadges: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badges = [
    { text: "End-to-end encrypted", icon: "🔐" },
    { text: "Zero data access", icon: "🚫" },
    { text: "Your data, your control", icon: "✓" },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: 30,
      marginTop: 50,
    }}>
      {badges.map((badge, i) => {
        const progress = spring({
          frame: frame - delay - i * 10,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 150 },
        });

        const y = interpolate(progress, [0, 1], [-50, 0], {
          easing: Easing.out(Easing.exp),
        });
        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const scale = interpolate(progress, [0, 0.8, 1], [0.8, 1.05, 1]);

        // Glow after appear
        const glow = progress > 0.9 ? Math.sin((frame - delay - i * 10) * 0.1) * 0.3 + 0.7 : 0;

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 32px',
              backgroundColor: 'rgba(34,197,94,0.08)',
              borderRadius: 50,
              border: '1px solid rgba(34,197,94,0.3)',
              boxShadow: `0 0 ${25 * glow}px rgba(34,197,94,0.2)`,
            }}
          >
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 0 10px #22c55e',
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 26,
              fontWeight: 500,
            }}>
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Vignette
const PrivacyVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.1 + 0.9;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(
        ellipse at center,
        transparent 20%,
        rgba(0,40,20,${0.3 * pulse}) 60%,
        rgba(0,20,10,${0.5 * pulse}) 100%
      )`,
      pointerEvents: 'none',
    }} />
  );
};

export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#050a08', overflow: 'hidden' }}>
      <AnimatedBackground variant="gradient" />

      {/* Code rain background */}
      <CodeRain />

      {/* Security perimeter rings */}
      <SecurityRings />

      {/* Encryption streams flowing to center */}
      <EncryptionStreams />

      {/* Orbiting mini locks */}
      <OrbitingLocks />

      {/* Hexagonal shield grid */}
      <HexShield delay={15} />

      {/* Lock shockwave on complete */}
      <LockShockwave delay={40} />

      {/* Lock burst particles */}
      <LockBurst delay={40} />

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
          }}
        >
          {/* Epic animated lock */}
          <EpicLock delay={5} />

          {/* Privacy text */}
          <PrivacyText delay={50} />

          {/* Trust badges */}
          <TrustBadges delay={85} />
        </div>
      </AbsoluteFill>

      {/* Green vignette */}
      <PrivacyVignette />
    </AbsoluteFill>
  );
};
