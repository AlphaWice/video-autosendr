import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Inter";

import { HookScene } from "./scenes/HookScene";
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

        {/* Scene 8: Trust/Privacy (36-39 sec) */}
        <TransitionSeries.Sequence durationInFrames={90}>
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
    </AbsoluteFill>
  );
};
