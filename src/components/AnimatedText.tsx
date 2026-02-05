import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const AnimatedTitle: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, delay = 0, fontSize = 72, color = "#fff", fontWeight = 700 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 20px" }}>
      {words.map((word, wordIndex) => {
        const wordDelay = delay + wordIndex * 5;

        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 200 },
        });

        const y = interpolate(progress, [0, 1], [60, 0]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const blur = interpolate(progress, [0, 1], [10, 0]);

        return (
          <span
            key={wordIndex}
            style={{
              fontSize,
              fontWeight,
              color,
              transform: `translateY(${y}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const GlitchText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
}> = ({ text, fontSize = 48, color = "#fff" }) => {
  const frame = useCurrentFrame();

  const glitchOffset = frame % 60 < 3 ? Math.random() * 4 - 2 : 0;
  const glitchOpacity = frame % 60 < 3 ? 0.8 : 1;

  return (
    <div style={{ position: "relative" }}>
      {/* Red channel */}
      <span
        style={{
          position: "absolute",
          fontSize,
          fontWeight: 700,
          color: "#ff0000",
          mixBlendMode: "screen",
          transform: `translateX(${glitchOffset}px)`,
          opacity: 0.5,
        }}
      >
        {text}
      </span>
      {/* Cyan channel */}
      <span
        style={{
          position: "absolute",
          fontSize,
          fontWeight: 700,
          color: "#00ffff",
          mixBlendMode: "screen",
          transform: `translateX(${-glitchOffset}px)`,
          opacity: 0.5,
        }}
      >
        {text}
      </span>
      {/* Main text */}
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color,
          opacity: glitchOpacity,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  speed?: number;
}> = ({ text, delay = 0, fontSize = 36, color = "#fff", speed = 2 }) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.min(
    Math.floor((frame - delay) / speed),
    text.length
  );
  const visibleText = text.slice(0, Math.max(0, charsToShow));
  const showCursor = (frame - delay) % 20 < 10 && charsToShow < text.length;

  return (
    <span style={{ fontSize, color, fontWeight: 500 }}>
      {visibleText}
      {showCursor && (
        <span style={{ opacity: 1, marginLeft: 2 }}>|</span>
      )}
    </span>
  );
};

export const CountUpNumber: React.FC<{
  target: number;
  delay?: number;
  fontSize?: number;
  duration?: number;
  suffix?: string;
}> = ({ target, delay = 0, fontSize = 72, duration = 30, suffix = "" }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.round(target * eased);

  return (
    <span style={{ fontSize, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
      {current}{suffix}
    </span>
  );
};

export const AnimatedGradientText: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
}> = ({ text, fontSize = 56, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const gradientPosition = (frame * 2) % 200;

  return (
    <span
      style={{
        fontSize,
        fontWeight: 700,
        background: `linear-gradient(90deg, #fff ${gradientPosition}%, #888 ${gradientPosition + 50}%, #fff ${gradientPosition + 100}%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
};

export const UnderlineReveal: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  underlineColor?: string;
}> = ({ text, fontSize = 48, delay = 0, underlineColor = "#22c55e" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const underlineProgress = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color: "#fff",
          opacity: textProgress,
          transform: `translateY(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
          display: "inline-block",
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: -4,
          left: 0,
          height: 4,
          width: `${underlineProgress * 100}%`,
          backgroundColor: underlineColor,
          borderRadius: 2,
        }}
      />
    </span>
  );
};
