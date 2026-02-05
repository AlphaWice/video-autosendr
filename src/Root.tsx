import { Composition } from "remotion";
import { AutoSendrVideo } from "./AutoSendrVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AutoSendrVideo"
        component={AutoSendrVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
