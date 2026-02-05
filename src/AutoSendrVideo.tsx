import { AbsoluteFill, Sequence, Audio, useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Inter";

import { HookScene } from "./scenes/HookScene";

// Fade in/out overlay component
const FadeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeInDuration = 30; // 1 second at 30fps
  const fadeOutDuration = 45; // 1.5 seconds at 30fps

  // Fade in from black at start
  const fadeInOpacity = interpolate(frame, [0, fadeInDuration], [1, 0], {
    extrapolateRight: 'clamp',
  });

  // Fade out to black at end
  const fadeOutOpacity = interpolate(
    frame,
    [durationInFrames - fadeOutDuration, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );

  const opacity = Math.max(fadeInOpacity, fadeOutOpacity);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        opacity,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { SchedulingScene } from "./scenes/SchedulingScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { UseCasesScene } from "./scenes/UseCasesScene";
import { PrivacyScene } from "./scenes/PrivacyScene";
import { CTAScene } from "./scenes/CTAScene";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const AutoSendrVideo: React.FC = () => {
  const transitionDuration = 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily,
      }}
    >
      {/* Background music - starts at 1:59 in the audio file */}
      <Audio
        src={staticFile("AutoSendr Sound.mp3")}
        volume={(f) => {
          const fadeInDuration = 60; // 2 seconds fade in
          const fadeOutStart = 1350 - 60; // Start fade out 2 seconds before end
          const fadeOutDuration = 60;

          // Fade in
          if (f < fadeInDuration) {
            return interpolate(f, [0, fadeInDuration], [0, 0.8]);
          }
          // Fade out
          if (f > fadeOutStart) {
            return interpolate(f, [fadeOutStart, fadeOutStart + fadeOutDuration], [0.8, 0]);
          }
          return 0.8;
        }}
        startFrom={119 * 30}  // 1 min 59 sec = 119 seconds × 30 fps = 3570 frames
      />

      <TransitionSeries>
        {/* Scene 1: Hook (0-3 sec) */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Problem (3-7 sec) */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Solution (7-12 sec) */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Dashboard Demo (12-18 sec) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <DashboardScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 5: Scheduling Flow (18-24 sec) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SchedulingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 6: Key Features (24-30 sec) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 7: Use Cases (30-36 sec) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <UseCasesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 8: Trust/Privacy (36-41 sec) */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <PrivacyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 9: CTA (39-45 sec) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Fade in/out overlay */}
      <FadeOverlay />
    </AbsoluteFill>
  );
};
