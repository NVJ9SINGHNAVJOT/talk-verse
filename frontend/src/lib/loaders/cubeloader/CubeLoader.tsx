import "@/lib/loaders/cubeloader/CubeLoader.css";
import { cn } from "@/utils/cn";

type CubeLoaderProps = {
  className?: string;
};

const CubeLoader = (props: CubeLoaderProps) => {
  return (
    <div className={cn("cube-container", props.className)}>
      <div className="cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
    </div>
  );
};

export default CubeLoader;
