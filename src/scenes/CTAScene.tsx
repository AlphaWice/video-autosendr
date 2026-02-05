import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { FloatingShapes, PulsingRing, GlowingOrb } from "../components/AnimatedShapes";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoRotate = interpolate(logoProgress, [0, 1], [-5, 0]);

  // Button animation
  const buttonProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 },
  });

  const buttonScale = interpolate(buttonProgress, [0, 1], [0.8, 1]);
  const buttonOpacity = interpolate(buttonProgress, [0, 1], [0, 1]);

  // URL animation
  const urlProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
  });

  // Pulsing glow for button
  const pulseIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7;

  // Logo icon drawing animation
  const iconDrawProgress = interpolate(logoProgress, [0, 1], [0, 1]);

  // Staggered letter animation
  const letters = "AutoSendr".split("");

  // Particle explosion on button appear
  const particleProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />
      <FloatingShapes />

      {/* Background pulsing rings */}
      <PulsingRing x={960} y={450} size={400} delay={0} />
      <PulsingRing x={960} y={450} size={500} delay={15} />
      <PulsingRing x={960} y={450} size={600} delay={30} />

      {/* Glowing orbs */}
      <GlowingOrb x={300} y={300} size={300} color="#fff" delay={0} />
      <GlowingOrb x={1600} y={700} size={250} color="#fff" delay={20} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
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
          {/* Logo with animated icon and letters */}
          <div
            style={{
              transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
              opacity: logoOpacity,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {/* Animated logo icon */}
            <div style={{ position: "relative" }}>
              <svg width="90" height="90" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ctaLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#888" />
                  </linearGradient>
                  <filter id="ctaGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  stroke="url(#ctaLogoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#ctaGlow)"
                  strokeDasharray="60"
                  strokeDashoffset={60 - 60 * iconDrawProgress}
                />
                <path
                  d="M2 17l10 5 10-5"
                  stroke="url(#ctaLogoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#ctaGlow)"
                  strokeDasharray="50"
                  strokeDashoffset={50 - 50 * iconDrawProgress}
                />
                <path
                  d="M2 12l10 5 10-5"
                  stroke="url(#ctaLogoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#ctaGlow)"
                  strokeDasharray="50"
                  strokeDashoffset={50 - 50 * iconDrawProgress}
                />
              </svg>
            </div>

            {/* Animated letters */}
            <div style={{ display: "flex" }}>
              {letters.map((letter, i) => {
                const letterProgress = spring({
                  frame: frame - i * 2,
                  fps,
                  config: { damping: 200 },
                });

                const y = interpolate(letterProgress, [0, 1], [50, 0]);
                const opacity = interpolate(letterProgress, [0, 1], [0, 1]);
                const blur = interpolate(letterProgress, [0, 1], [10, 0]);

                return (
                  <span
                    key={i}
                    style={{
                      fontSize: 100,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-4px",
                      transform: `translateY(${y}px)`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      display: "inline-block",
                      textShadow: "0 0 40px rgba(255,255,255,0.3)",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          {/* CTA Button with glow and particles */}
          <div style={{ position: "relative" }}>
            {/* Particle burst */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const distance = particleProgress * 150;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const opacity = interpolate(particleProgress, [0, 0.3, 1], [0, 1, 0]);

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    transform: `translate(${x - 4}px, ${y - 4}px)`,
                    opacity,
                    boxShadow: "0 0 10px #fff",
                  }}
                />
              );
            })}

            {/* Button glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                height: "150%",
                background: `radial-gradient(ellipse, rgba(255,255,255,${pulseIntensity * 0.15}) 0%, transparent 70%)`,
                borderRadius: 60,
              }}
            />

            {/* Button */}
            <div
              style={{
                transform: `scale(${buttonScale})`,
                opacity: buttonOpacity,
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #e0e0e0 100%)",
                  color: "#000",
                  fontSize: 36,
                  fontWeight: 700,
                  padding: "28px 70px",
                  borderRadius: 60,
                  boxShadow: `
                    0 20px 60px rgba(255,255,255,0.3),
                    0 0 ${40 * pulseIntensity}px rgba(255,255,255,0.2),
                    inset 0 2px 0 rgba(255,255,255,0.5)
                  `,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                Start Free – No Card Needed
              </div>
            </div>
          </div>

          {/* URL with animated typing effect */}
          <div
            style={{
              opacity: interpolate(urlProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(urlProgress, [0, 1], [20, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 10px #22c55e",
              }}
            />
            <span
              style={{
                fontSize: 32,
                color: "#888",
                letterSpacing: 3,
                fontWeight: 500,
              }}
            >
              autosendr.com
            </span>
          </div>

          {/* Animated arrow pointing to button */}
          <div
            style={{
              position: "absolute",
              bottom: 150,
              opacity: interpolate(frame, [70, 90, 150, 170], [0, 0.6, 0.6, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${Math.sin(frame * 0.15) * 8}px)`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12l7 7 7-7"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
