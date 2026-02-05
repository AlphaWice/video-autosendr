import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Glitch text effect with chromatic aberration
const GlitchText: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

  // Random glitch offsets
  const glitchTime = frame - delay;
  const isGlitching = glitchTime > 5 && glitchTime < 20 && Math.random() > 0.7;
  const glitchX = isGlitching ? (Math.random() - 0.5) * 10 : 0;
  const glitchY = isGlitching ? (Math.random() - 0.5) * 5 : 0;

  // Chromatic aberration during glitch
  const redOffset = isGlitching ? -3 : 0;
  const blueOffset = isGlitching ? 3 : 0;

  // Text scramble effect
  const scrambleProgress = interpolate(glitchTime, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const displayText = scrambleProgress < 1
    ? text.split('').map((char, i) => {
        if (Math.random() > scrambleProgress + 0.3) {
          const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
          return chars[Math.floor(Math.random() * chars.length)];
        }
        return char;
      }).join('')
    : text;

  return (
    <div style={{ position: 'relative', opacity }}>
      {/* Red channel offset */}
      <span style={{
        position: 'absolute',
        color: 'rgba(255,0,0,0.8)',
        transform: `translate(${redOffset + glitchX}px, ${glitchY}px)`,
        mixBlendMode: 'screen',
      }}>
        {displayText}
      </span>
      {/* Blue channel offset */}
      <span style={{
        position: 'absolute',
        color: 'rgba(0,100,255,0.8)',
        transform: `translate(${blueOffset + glitchX}px, ${-glitchY}px)`,
        mixBlendMode: 'screen',
      }}>
        {displayText}
      </span>
      {/* Main text */}
      <span style={{
        position: 'relative',
        color: '#fff',
        transform: `translate(${glitchX}px, ${glitchY}px)`,
      }}>
        {displayText}
      </span>
    </div>
  );
};

// Explosive impact particles
const ImpactParticles: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  const frame = useCurrentFrame();
  const particleFrame = frame - delay - 10;

  if (particleFrame < 0 || particleFrame > 40) return null;

  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.5;
    const speed = 8 + Math.random() * 12;
    const size = 3 + Math.random() * 6;
    const distance = particleFrame * speed;
    const opacity = interpolate(particleFrame, [0, 30, 40], [1, 0.5, 0]);
    const px = Math.cos(angle) * distance;
    const py = Math.sin(angle) * distance - particleFrame * 0.5; // slight gravity

    return { px, py, size, opacity, angle };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x + p.px,
            top: y + p.py,
            width: p.size,
            height: p.size,
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            opacity: p.opacity,
            boxShadow: '0 0 10px #ff6b6b, 0 0 20px #ff0000',
          }}
        />
      ))}
    </>
  );
};

// Shockwave ring effect
const ShockwaveRing: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  const frame = useCurrentFrame();
  const ringFrame = frame - delay - 8;

  if (ringFrame < 0 || ringFrame > 35) return null;

  const scale = interpolate(ringFrame, [0, 35], [0.1, 3]);
  const opacity = interpolate(ringFrame, [0, 10, 35], [0.8, 0.4, 0]);
  const borderWidth = interpolate(ringFrame, [0, 35], [8, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        border: `${borderWidth}px solid rgba(255,107,107,${opacity})`,
        transform: `scale(${scale})`,
        boxShadow: `0 0 30px rgba(255,0,0,${opacity * 0.5})`,
      }}
    />
  );
};

// Animated cross that slashes in
const SlashingCross: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slashProgress = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 8, mass: 0.3, stiffness: 200 },
  });

  const rotateIn = interpolate(slashProgress, [0, 1], [180, 0]);
  const scale = interpolate(slashProgress, [0, 0.8, 1], [0, 1.3, 1]);

  // Glow pulse after appear
  const glowFrame = frame - delay - 20;
  const glow = glowFrame > 0 ? Math.sin(glowFrame * 0.2) * 10 + 15 : 0;

  return (
    <div style={{
      transform: `rotate(${rotateIn}deg) scale(${scale})`,
      filter: `drop-shadow(0 0 ${glow}px #ff0000)`,
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24">
        <path
          d="M18 6L6 18"
          stroke="#ff6b6b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="20"
          strokeDashoffset={20 - 20 * slashProgress}
        />
        <path
          d="M6 6l12 12"
          stroke="#ff6b6b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="20"
          strokeDashoffset={20 - 20 * interpolate(slashProgress, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp' })}
        />
      </svg>
    </div>
  );
};

// Scan line effect
const ScanLines: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.1) 2px,
        rgba(0,0,0,0.1) 4px
      )`,
      pointerEvents: 'none',
      opacity: 0.5,
    }}>
      {/* Moving scan line */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 4,
        background: 'linear-gradient(90deg, transparent, rgba(255,100,100,0.3), transparent)',
        top: (frame * 8) % 1200 - 100,
        boxShadow: '0 0 20px rgba(255,0,0,0.5)',
      }} />
    </div>
  );
};

// Warning flash overlay
const WarningFlash: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const flashFrame = frame - delay;

  if (flashFrame < 0 || flashFrame > 10) return null;

  const opacity = interpolate(flashFrame, [0, 3, 10], [0.3, 0.15, 0]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#ff0000',
      opacity,
      pointerEvents: 'none',
    }} />
  );
};

// Screen shake wrapper
const ScreenShake: React.FC<{ children: React.ReactNode; intensity: number }> = ({ children, intensity }) => {
  const frame = useCurrentFrame();

  // Shake on specific frames (when cards appear)
  const shakeFrames = [25, 45, 65];
  let shakeX = 0;
  let shakeY = 0;

  shakeFrames.forEach((sf) => {
    const diff = frame - sf;
    if (diff >= 0 && diff < 12) {
      const decay = Math.exp(-diff * 0.3);
      shakeX += Math.sin(diff * 3) * intensity * decay;
      shakeY += Math.cos(diff * 4) * intensity * 0.5 * decay;
    }
  });

  return (
    <div style={{
      transform: `translate(${shakeX}px, ${shakeY}px)`,
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    }}>
      {children}
    </div>
  );
};

// Floating debris/fragments
const ChaosParticles: React.FC = () => {
  const frame = useCurrentFrame();

  const fragments = Array.from({ length: 30 }, (_, i) => {
    const startX = (i * 137) % 1920;
    const startY = (i * 89) % 1080;
    const speed = 0.5 + (i % 5) * 0.2;
    const rotation = frame * (1 + (i % 3)) * 2;
    const floatX = Math.sin(frame * 0.02 + i) * 30;
    const floatY = Math.cos(frame * 0.015 + i * 0.5) * 20;
    const size = 4 + (i % 8);
    const opacity = 0.1 + (i % 5) * 0.05;

    return { x: startX + floatX, y: startY + floatY, size, rotation, opacity };
  });

  return (
    <>
      {fragments.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: f.x,
            top: f.y,
            width: f.size,
            height: f.size,
            backgroundColor: i % 2 === 0 ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.1)',
            transform: `rotate(${f.rotation}deg)`,
            opacity: f.opacity,
          }}
        />
      ))}
    </>
  );
};

// Electric arc effect
const ElectricArc: React.FC<{ delay: number; startX: number; startY: number; endX: number; endY: number }> =
  ({ delay, startX, startY, endX, endY }) => {
  const frame = useCurrentFrame();
  const arcFrame = frame - delay;

  if (arcFrame < 0 || arcFrame > 25) return null;

  const opacity = interpolate(arcFrame, [0, 5, 25], [1, 0.8, 0]);

  // Generate jagged lightning path
  const points: string[] = [`${startX},${startY}`];
  const segments = 8;
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 40;
    const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 30;
    points.push(`${x},${y}`);
  }
  points.push(`${endX},${endY}`);

  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="3"
        opacity={opacity}
        style={{ filter: 'drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 20px #ff6b6b)' }}
      />
    </svg>
  );
};

// Main problem card with insane animations
const AnimatedProblemCard: React.FC<{
  text: string;
  delay: number;
  index: number;
  totalCards: number;
}> = ({ text, delay, index, totalCards }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Explosive spring entrance
  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 150 },
  });

  // Card flies in from different directions with rotation
  const directions = [
    { x: -800, y: -200, rotate: -45 },
    { x: 800, y: 100, rotate: 35 },
    { x: -600, y: 300, rotate: -25 },
  ];
  const dir = directions[index % 3];

  const x = interpolate(entryProgress, [0, 1], [dir.x, 0], {
    easing: Easing.out(Easing.exp),
  });
  const y = interpolate(entryProgress, [0, 1], [dir.y, 0], {
    easing: Easing.out(Easing.exp),
  });
  const rotate = interpolate(entryProgress, [0, 1], [dir.rotate, 0]);
  const scale = interpolate(entryProgress, [0, 0.7, 1], [0.3, 1.15, 1]);
  const opacity = interpolate(entryProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Impact bounce after landing
  const impactFrame = frame - delay - 15;
  const impactBounce = impactFrame > 0 && impactFrame < 15
    ? Math.sin(impactFrame * 0.8) * Math.exp(-impactFrame * 0.2) * 8
    : 0;

  // Continuous subtle hover animation
  const hoverY = Math.sin((frame - delay) * 0.08) * 3;
  const hoverRotate = Math.sin((frame - delay) * 0.05) * 0.5;

  // Pulsing danger glow
  const glowIntensity = frame > delay + 20
    ? Math.sin((frame - delay) * 0.15) * 0.4 + 0.6
    : 0;

  // Card width animation (slam effect)
  const widthStretch = interpolate(entryProgress, [0.8, 0.9, 1], [1.1, 0.95, 1], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `
          translateX(${x}px)
          translateY(${y + impactBounce + hoverY}px)
          rotate(${rotate + hoverRotate}deg)
          scale(${scale})
          scaleX(${widthStretch})
        `,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "22px 45px",
        backgroundColor: "rgba(30,10,10,0.8)",
        borderRadius: 20,
        border: "2px solid rgba(255,107,107,0.5)",
        marginBottom: 20,
        boxShadow: `
          0 0 ${30 * glowIntensity}px rgba(255,50,50,0.4),
          0 0 ${60 * glowIntensity}px rgba(255,0,0,0.2),
          inset 0 0 30px rgba(255,50,50,0.1)
        `,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          backgroundColor: "rgba(255,50,50,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: '2px solid rgba(255,107,107,0.3)',
          flexShrink: 0,
        }}
      >
        <SlashingCross delay={delay} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 700 }}>
        <GlitchText text={text} delay={delay} />
      </div>
    </div>
  );
};

// Dramatic title with shatter effect
const DramaticTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 0.5, 1], [3, 0.9, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const blur = interpolate(progress, [0, 0.5], [20, 0], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [-50, 0]);

  // Glitch flicker
  const flicker = frame > 10 && frame < 20 && Math.random() > 0.6 ? 0.5 : 1;

  // Continuous warning pulse
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;

  return (
    <div
      style={{
        opacity: opacity * flicker,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        fontSize: 36,
        color: `rgba(255,${100 * pulse},${100 * pulse},1)`,
        textTransform: "uppercase",
        letterSpacing: 12,
        marginBottom: 50,
        fontWeight: 800,
        textShadow: `
          0 0 20px rgba(255,0,0,${pulse * 0.5}),
          0 0 40px rgba(255,0,0,${pulse * 0.3}),
          0 0 60px rgba(255,0,0,${pulse * 0.2})
        `,
      }}
    >
      ⚠ THE PROBLEM ⚠
    </div>
  );
};

// Animated warning stripes
const WarningStripes: React.FC = () => {
  const frame = useCurrentFrame();

  const offset = frame * 2;

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        background: `repeating-linear-gradient(
          45deg,
          #ff6b6b,
          #ff6b6b 20px,
          #1a1a1a 20px,
          #1a1a1a 40px
        )`,
        backgroundPosition: `${offset}px 0`,
        opacity: 0.8,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        background: `repeating-linear-gradient(
          -45deg,
          #ff6b6b,
          #ff6b6b 20px,
          #1a1a1a 20px,
          #1a1a1a 40px
        )`,
        backgroundPosition: `${-offset}px 0`,
        opacity: 0.8,
      }} />
    </>
  );
};

// Pulsing danger rings in background
const DangerRings: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [0, 20, 40, 60];

  return (
    <>
      {rings.map((delay, i) => {
        const progress = ((frame + delay) % 80) / 80;
        const scale = interpolate(progress, [0, 1], [0.3, 2.5]);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.25, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 - 300, // Center of 1920
              top: 540 - 300, // Center of 1080
              width: 600,
              height: 600,
              borderRadius: '50%',
              border: '3px solid rgba(255,50,50,0.5)',
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

// Vignette effect
const DangerVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.08) * 0.1 + 0.9;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `radial-gradient(
        ellipse at center,
        transparent 30%,
        rgba(80,0,0,${0.3 * pulse}) 70%,
        rgba(40,0,0,${0.6 * pulse}) 100%
      )`,
      pointerEvents: 'none',
    }} />
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const problems = [
    { text: "Scattered messaging", delay: 20 },
    { text: "Missed follow-ups", delay: 40 },
    { text: "Lost leads", delay: 60 },
  ];

  // Global zoom effect - subtle pulse, not starting zoomed in
  const zoom = interpolate(frame, [0, 20, 90, 120], [1, 1, 1, 1.01], {
    extrapolateRight: 'clamp',
  });

  // Card vertical positions (centered on 1080p screen)
  const cardStartY = 400; // First card Y position
  const cardSpacing = 115; // Space between cards

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <ScreenShake intensity={12}>
        <div style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          <AnimatedBackground variant="default" />

          {/* Chaos elements */}
          <ChaosParticles />
          <DangerRings />

          {/* Warning stripes */}
          <WarningStripes />

          {/* Scan lines for that danger feel */}
          <ScanLines />

          {/* Electric arcs */}
          <ElectricArc delay={22} startX={200} startY={350} endX={450} endY={480} />
          <ElectricArc delay={42} startX={1700} startY={450} endX={1450} endY={580} />
          <ElectricArc delay={62} startX={250} startY={650} endX={500} endY={750} />

          {/* Impact effects for each card */}
          {problems.map((p, i) => (
            <ShockwaveRing key={`shock-${i}`} delay={p.delay} x={960} y={cardStartY + i * cardSpacing} />
          ))}
          {problems.map((p, i) => (
            <ImpactParticles key={`impact-${i}`} delay={p.delay} x={960} y={cardStartY + i * cardSpacing} />
          ))}

          {/* Warning flashes */}
          <WarningFlash delay={25} />
          <WarningFlash delay={45} />
          <WarningFlash delay={65} />

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
              }}
            >
              {/* Dramatic Title */}
              <DramaticTitle />

              {/* Problem cards with insane animations */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {problems.map((problem, index) => (
                  <AnimatedProblemCard
                    key={problem.text}
                    text={problem.text}
                    delay={problem.delay}
                    index={index}
                    totalCards={problems.length}
                  />
                ))}
              </div>
            </div>
          </AbsoluteFill>

          {/* Danger vignette overlay */}
          <DangerVignette />
        </div>
      </ScreenShake>
    </AbsoluteFill>
  );
};
