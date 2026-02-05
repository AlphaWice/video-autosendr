import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Flying paper plane with trail
const FlyingPaperPlane: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}> = ({ startX, startY, endX, endY, delay, duration, size, rotation }) => {
  const frame = useCurrentFrame();
  const planeFrame = frame - delay;

  if (planeFrame < 0 || planeFrame > duration + 30) return null;

  const progress = Math.min(planeFrame / duration, 1);
  const eased = Easing.out(Easing.quad)(progress);

  const x = interpolate(eased, [0, 1], [startX, endX]);
  const y = interpolate(eased, [0, 1], [startY, endY]);

  // Wobble effect
  const wobble = Math.sin(planeFrame * 0.3) * 8;
  const wobbleRotate = Math.sin(planeFrame * 0.2) * 5;

  // Fade in and out
  const opacity = interpolate(planeFrame, [0, 15, duration - 15, duration], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  // Trail particles
  const trailParticles = Array.from({ length: 8 }, (_, i) => {
    const trailProgress = Math.max(0, (planeFrame - i * 3) / duration);
    const trailEased = Easing.out(Easing.quad)(Math.min(trailProgress, 1));
    const trailX = interpolate(trailEased, [0, 1], [startX, endX]);
    const trailY = interpolate(trailEased, [0, 1], [startY, endY]);
    const trailOpacity = interpolate(i, [0, 7], [0.6, 0.1]) * opacity;
    const trailSize = interpolate(i, [0, 7], [size * 0.4, size * 0.1]);

    return { x: trailX, y: trailY, opacity: trailOpacity, size: trailSize };
  });

  return (
    <>
      {/* Trail */}
      {trailParticles.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: t.x,
            top: t.y + wobble * (1 - i / 8),
            width: t.size,
            height: t.size,
            borderRadius: '50%',
            backgroundColor: '#fff',
            opacity: t.opacity,
            filter: 'blur(2px)',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}
        />
      ))}
      {/* Paper plane */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y + wobble,
          transform: `rotate(${rotation + wobbleRotate}deg)`,
          opacity,
          filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

// Shooting star effect
const ShootingStar: React.FC<{
  startX: number;
  startY: number;
  angle: number;
  delay: number;
  speed: number;
}> = ({ startX, startY, angle, delay, speed }) => {
  const frame = useCurrentFrame();
  const starFrame = frame - delay;

  if (starFrame < 0 || starFrame > 40) return null;

  const distance = starFrame * speed;
  const x = startX + Math.cos(angle) * distance;
  const y = startY + Math.sin(angle) * distance;
  const opacity = interpolate(starFrame, [0, 10, 40], [0, 1, 0]);
  const length = 80 + speed * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: length,
        height: 3,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity * 0.8}))`,
        transform: `rotate(${(angle * 180) / Math.PI}deg)`,
        borderRadius: 2,
        boxShadow: `0 0 10px rgba(255,255,255,${opacity})`,
      }}
    />
  );
};

// Message bubble floating
const FloatingMessage: React.FC<{
  x: number;
  y: number;
  delay: number;
  size: number;
}> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 0.8, 1], [0, 1.1, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 0.6], { extrapolateRight: 'clamp' });

  // Float animation
  const floatY = Math.sin((frame - delay) * 0.05) * 10;
  const floatX = Math.cos((frame - delay) * 0.03) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + floatX,
        top: y + floatY,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          fill="rgba(34,197,94,0.3)"
          stroke="#22c55e"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

// Speed lines background
const SpeedLines: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = Array.from({ length: 40 }, (_, i) => {
    const y = (i / 40) * 1080;
    const speed = 15 + (i % 5) * 5;
    const length = 100 + (i % 4) * 50;
    const x = ((frame * speed + i * 100) % 2200) - 200;
    const opacity = 0.05 + (i % 3) * 0.03;

    return { x, y, length, opacity };
  });

  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: line.x,
            top: line.y,
            width: line.length,
            height: 2,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${line.opacity}), transparent)`,
            borderRadius: 1,
          }}
        />
      ))}
    </>
  );
};

// Aurora/gradient wave effect
const AuroraWave: React.FC = () => {
  const frame = useCurrentFrame();

  const waves = [
    { color: 'rgba(34,197,94,0.15)', speed: 0.02, offset: 0, amplitude: 100 },
    { color: 'rgba(74,222,128,0.1)', speed: 0.025, offset: 50, amplitude: 80 },
    { color: 'rgba(134,239,172,0.08)', speed: 0.015, offset: 100, amplitude: 120 },
  ];

  return (
    <>
      {waves.map((wave, i) => {
        const y = 540 + Math.sin(frame * wave.speed) * wave.amplitude + wave.offset;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: y - 200,
              width: '100%',
              height: 400,
              background: `radial-gradient(ellipse 100% 100% at 50% 100%, ${wave.color}, transparent)`,
              filter: 'blur(40px)',
            }}
          />
        );
      })}
    </>
  );
};

// Confetti celebration
const Confetti: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const confettiFrame = frame - delay;

  if (confettiFrame < 0) return null;

  const pieces = Array.from({ length: 50 }, (_, i) => {
    const startX = 960 + (Math.random() - 0.5) * 200;
    const startY = 400;
    const angle = (Math.random() - 0.5) * Math.PI;
    const speed = 4 + Math.random() * 6;
    const rotationSpeed = (Math.random() - 0.5) * 20;
    const gravity = 0.3;

    const x = startX + Math.cos(angle) * confettiFrame * speed;
    const y = startY - Math.sin(angle) * confettiFrame * speed + gravity * confettiFrame * confettiFrame * 0.1;
    const rotation = confettiFrame * rotationSpeed;
    const opacity = interpolate(confettiFrame, [0, 20, 80, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

    const colors = ['#22c55e', '#4ade80', '#86efac', '#fff', '#fbbf24'];
    const color = colors[i % colors.length];

    return { x, y, rotation, opacity, color, width: 8 + (i % 4) * 4, height: 4 + (i % 3) * 2 };
  });

  return (
    <>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            borderRadius: 2,
          }}
        />
      ))}
    </>
  );
};

// Energy burst rings
const EnergyRings: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [0, 25, 50, 75];

  return (
    <>
      {rings.map((delay, i) => {
        const ringFrame = (frame + delay) % 100;
        const scale = interpolate(ringFrame, [0, 100], [0.5, 3]);
        const opacity = interpolate(ringFrame, [0, 30, 100], [0, 0.4, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 - 200,
              top: 400 - 200,
              width: 400,
              height: 400,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.5)',
              transform: `scale(${scale})`,
              opacity,
              boxShadow: '0 0 30px rgba(255,255,255,0.3)',
            }}
          />
        );
      })}
    </>
  );
};

// Particle field
const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 60 }, (_, i) => {
    const baseX = (i * 37) % 1920;
    const baseY = (i * 23) % 1080;
    const speed = 0.02 + (i % 5) * 0.01;
    const x = baseX + Math.sin(frame * speed + i) * 50;
    const y = baseY + Math.cos(frame * speed * 0.8 + i * 0.5) * 40;
    const size = 2 + (i % 4) * 2;
    const opacity = 0.2 + Math.sin(frame * 0.05 + i) * 0.15;

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
            backgroundColor: i % 3 === 0 ? '#22c55e' : '#fff',
            opacity: p.opacity,
            boxShadow: i % 3 === 0 ? '0 0 8px #22c55e' : '0 0 6px rgba(255,255,255,0.5)',
          }}
        />
      ))}
    </>
  );
};

// Glowing logo
const GlowingLogo: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 80 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.1, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const rotate = interpolate(progress, [0, 1], [-10, 0]);

  // Glow pulse
  const glowPulse = frame > delay + 30 ? Math.sin((frame - delay - 30) * 0.08) * 20 + 30 : 0;

  // Icon draw
  const drawProgress = interpolate(progress, [0.2, 1], [0, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        filter: `drop-shadow(0 0 ${glowPulse}px rgba(255,255,255,0.6))`,
      }}
    >
      <svg width="140" height="140" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <path
          d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="100"
          strokeDashoffset={100 - 100 * drawProgress}
        />
      </svg>
    </div>
  );
};

// Animated logo text
const LogoText: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "AutoSendr".split("");

  return (
    <div style={{ display: 'flex' }}>
      {letters.map((letter, i) => {
        const progress = spring({
          frame: frame - delay - i * 3,
          fps,
          config: { damping: 15, mass: 0.5, stiffness: 120 },
        });

        const y = interpolate(progress, [0, 1], [80, 0]);
        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        const scale = interpolate(progress, [0, 0.8, 1], [0.5, 1.1, 1]);
        const blur = interpolate(progress, [0, 0.5], [15, 0], { extrapolateRight: 'clamp' });
        const rotate = interpolate(progress, [0, 1], [20, 0]);

        // Glow after appear
        const glow = progress > 0.9 ? Math.sin((frame - delay - i * 3) * 0.1) * 5 + 10 : 0;

        return (
          <span
            key={i}
            style={{
              fontSize: 130,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-5px',
              transform: `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
              opacity,
              filter: `blur(${blur}px)`,
              display: 'inline-block',
              textShadow: `0 0 ${glow + 30}px rgba(255,255,255,0.4), 0 0 60px rgba(34,197,94,0.3)`,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

// Epic CTA button
const CTAButton: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.08, 1]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [50, 0]);

  // Pulsing glow
  const pulseGlow = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.12) * 0.4 + 0.6 : 0;

  // Shine sweep
  const shineX = ((frame - delay) % 80) / 80;
  const shinePos = interpolate(shineX, [0, 1], [-100, 400]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${y}px)`,
        opacity,
        position: 'relative',
      }}
    >
      {/* Glow behind button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '200%',
          background: `radial-gradient(ellipse, rgba(255,255,255,${pulseGlow * 0.2}) 0%, transparent 60%)`,
          borderRadius: 80,
          filter: 'blur(20px)',
        }}
      />

      {/* Button */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff 0%, #e8e8e8 50%, #fff 100%)',
          color: '#000',
          fontSize: 44,
          fontWeight: 700,
          padding: '34px 90px',
          borderRadius: 70,
          boxShadow: `
            0 25px 80px rgba(255,255,255,0.4),
            0 0 ${60 * pulseGlow}px rgba(255,255,255,0.3),
            inset 0 2px 0 rgba(255,255,255,0.8),
            inset 0 -2px 0 rgba(0,0,0,0.1)
          `,
          border: '2px solid rgba(255,255,255,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Shine effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: shinePos,
            width: 60,
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        <span style={{ position: 'relative' }}>Start Free – No Card Needed</span>
      </div>
    </div>
  );
};

// URL with animation
const AnimatedURL: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.5, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [30, 0]);
  const scale = interpolate(progress, [0, 0.8, 1], [0.9, 1.02, 1]);

  // Dot pulse
  const dotPulse = frame > delay + 20 ? Math.sin((frame - delay - 20) * 0.15) * 0.3 + 0.7 : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          boxShadow: `0 0 ${15 * dotPulse}px #22c55e, 0 0 ${30 * dotPulse}px rgba(34,197,94,0.5)`,
        }}
      />
      <span
        style={{
          fontSize: 40,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 4,
          fontWeight: 500,
        }}
      >
        autosendr.com
      </span>
    </div>
  );
};

// Main CTA Scene
export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Paper planes configuration
  const planes = [
    { startX: -100, startY: 200, endX: 2100, endY: 400, delay: 10, duration: 120, size: 50, rotation: 25 },
    { startX: 2020, startY: 600, endX: -100, endY: 300, delay: 30, duration: 100, size: 40, rotation: -155 },
    { startX: -50, startY: 800, endX: 2000, endY: 500, delay: 50, duration: 110, size: 45, rotation: 20 },
    { startX: 1950, startY: 150, endX: -50, endY: 700, delay: 70, duration: 130, size: 55, rotation: -160 },
    { startX: -100, startY: 500, endX: 2100, endY: 200, delay: 90, duration: 100, size: 35, rotation: 15 },
    { startX: 2000, startY: 900, endX: 0, endY: 400, delay: 20, duration: 140, size: 48, rotation: -150 },
  ];

  // Shooting stars
  const stars = [
    { startX: 200, startY: 100, angle: 0.3, delay: 15, speed: 25 },
    { startX: 1600, startY: 150, angle: 2.5, delay: 45, speed: 30 },
    { startX: 400, startY: 50, angle: 0.5, delay: 75, speed: 22 },
    { startX: 1400, startY: 80, angle: 2.8, delay: 105, speed: 28 },
    { startX: 800, startY: 30, angle: 0.4, delay: 135, speed: 26 },
  ];

  // Floating messages
  const messages = [
    { x: 150, y: 300, delay: 20, size: 40 },
    { x: 1700, y: 250, delay: 35, size: 35 },
    { x: 200, y: 700, delay: 50, size: 45 },
    { x: 1650, y: 750, delay: 65, size: 38 },
    { x: 100, y: 500, delay: 80, size: 32 },
    { x: 1750, y: 500, delay: 95, size: 42 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      <AnimatedBackground variant="gradient" />

      {/* Aurora wave effect */}
      <AuroraWave />

      {/* Speed lines */}
      <SpeedLines />

      {/* Particle field */}
      <ParticleField />

      {/* Energy rings */}
      <EnergyRings />

      {/* Shooting stars */}
      {stars.map((star, i) => (
        <ShootingStar key={i} {...star} />
      ))}

      {/* Flying paper planes */}
      {planes.map((plane, i) => (
        <FlyingPaperPlane key={i} {...plane} />
      ))}

      {/* Floating message bubbles */}
      {messages.map((msg, i) => (
        <FloatingMessage key={i} {...msg} />
      ))}

      {/* Confetti celebration */}
      <Confetti delay={25} />

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
            gap: 50,
          }}
        >
          {/* Logo with icon and text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 30,
            }}
          >
            <GlowingLogo delay={0} />
            <LogoText delay={5} />
          </div>

          {/* CTA Button */}
          <CTAButton delay={35} />

          {/* URL */}
          <AnimatedURL delay={55} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
