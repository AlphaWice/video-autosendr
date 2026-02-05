import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const AnimatedCheckmark: React.FC<{
  size?: number;
  delay?: number;
}> = ({ size = 100, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circleProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const checkProgress = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 200 },
  });

  const pathLength = interpolate(checkProgress, [0, 1], [0, 1]);
  const pulse = Math.sin(frame * 0.1) * 0.05 + 1;

  return (
    <div
      style={{
        transform: `scale(${circleProgress * pulse})`,
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#22c55e"
          opacity={circleProgress}
          filter="url(#glow)"
        />

        {/* Checkmark */}
        <path
          d="M30 50 L45 65 L70 35"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="60"
          strokeDashoffset={60 - 60 * pathLength}
        />
      </svg>
    </div>
  );
};

export const AnimatedClock: React.FC<{
  size?: number;
  delay?: number;
}> = ({ size = 60, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const handRotation = frame * 3;

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="12"
          y1="12"
          x2="12"
          y2="7"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${handRotation}, 12, 12)`}
        />
        <line
          x1="12"
          y1="12"
          x2="16"
          y2="12"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${handRotation * 0.08}, 12, 12)`}
        />
        <circle cx="12" cy="12" r="1.5" fill="#fff" />
      </svg>
    </div>
  );
};

export const AnimatedMessage: React.FC<{
  size?: number;
  delay?: number;
}> = ({ size = 60, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const dotProgress = (frame - delay) % 30;
  const dot1 = dotProgress > 5 ? 1 : 0.3;
  const dot2 = dotProgress > 10 ? 1 : 0.3;
  const dot3 = dotProgress > 15 ? 1 : 0.3;

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="10" r="1.5" fill="#fff" opacity={dot1} />
        <circle cx="12" cy="10" r="1.5" fill="#fff" opacity={dot2} />
        <circle cx="16" cy="10" r="1.5" fill="#fff" opacity={dot3} />
      </svg>
    </div>
  );
};

export const AnimatedShield: React.FC<{
  size?: number;
  delay?: number;
}> = ({ size = 120, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const pulse = Math.sin(frame * 0.08) * 0.05 + 1;
  const glowIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const checkProgress = spring({
    frame: frame - delay - 15,
    fps,
    config: { damping: 200 },
  });

  return (
    <div style={{ transform: `scale(${scale * pulse})` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <filter id="shield-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shield body */}
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(34, 197, 94, 0.15)"
          filter="url(#shield-glow)"
          opacity={glowIntensity}
        />

        {/* Checkmark */}
        <path
          d="M9 12l2 2 4-4"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12"
          strokeDashoffset={12 - 12 * checkProgress}
        />
      </svg>
    </div>
  );
};

export const AnimatedRocket: React.FC<{
  size?: number;
  delay?: number;
}> = ({ size = 60, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const shake = Math.sin(frame * 0.5) * 2;
  const flameFlicker = Math.sin(frame * 0.8) * 0.3 + 0.7;

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${shake}px)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        {/* Rocket body */}
        <path
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />

        {/* Flame */}
        <ellipse
          cx="6"
          cy="19"
          rx="2"
          ry="3"
          fill="#f97316"
          opacity={flameFlicker}
        />
      </svg>
    </div>
  );
};
