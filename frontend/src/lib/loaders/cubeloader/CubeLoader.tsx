import "@/lib/loaders/CubeLoader.css";

const CubeLoader = () => {
  return (
    <div className="cube-container self-center">
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
