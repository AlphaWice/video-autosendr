import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { FloatingShapes, PulsingRing } from "../components/AnimatedShapes";
import { AnimatedTitle } from "../components/AnimatedText";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const logoRotate = interpolate(logoScale, [0, 1], [-10, 0]);
  const logoOpacity = interpolate(logoScale, [0, 0.5], [0, 1]);

  // Staggered letter animation for "AutoSendr"
  const letters = "AutoSendr".split("");

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="gradient" />
      <FloatingShapes />

      {/* Pulsing rings behind logo */}
      <PulsingRing x={960} y={400} size={300} delay={0} />

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
          {/* Logo with icon */}
          <div
            style={{
              transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
              opacity: logoOpacity,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Animated logo icon */}
            <div style={{ position: "relative" }}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#888" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="50"
                  strokeDashoffset={interpolate(logoScale, [0, 1], [50, 0])}
                />
                <path
                  d="M2 17l10 5 10-5"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={interpolate(logoScale, [0, 1], [50, 0])}
                />
                <path
                  d="M2 12l10 5 10-5"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={interpolate(logoScale, [0, 1], [50, 0])}
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

                const y = interpolate(letterProgress, [0, 1], [40, 0]);
                const opacity = interpolate(letterProgress, [0, 1], [0, 1]);
                const blur = interpolate(letterProgress, [0, 1], [8, 0]);

                return (
                  <span
                    key={i}
                    style={{
                      fontSize: 88,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-3px",
                      transform: `translateY(${y}px)`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      display: "inline-block",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Tagline with word animation */}
          <AnimatedTitle
            text="Automate your WhatsApp outreach"
            delay={25}
            fontSize={62}
            fontWeight={600}
          />

          {/* Animated underline */}
          <div
            style={{
              position: "relative",
              marginTop: -20,
            }}
          >
            <div
              style={{
                height: 4,
                width: interpolate(
                  spring({ frame: frame - 50, fps, config: { damping: 200 } }),
                  [0, 1],
                  [0, 500]
                ),
                background: "linear-gradient(90deg, transparent, #fff, transparent)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
