import React from "react";
import "@/lib/loaders/multicubeloader/MultiCubeLoader.css";
const MultiCubeLoader = () => {
  const cubeRows = [-1, 0, 1];
  const cubeColumns = [3, 2, 1];

  return (
    <div className="multiContainer self-center">
      {Array(3)
        .fill(null)
        .map((_, cubeIndex) => (
          <div key={cubeIndex} className="multiCube">
            {cubeRows.map((x) => (
              <div key={x} style={{ "--x": x, "--y": 0 } as React.CSSProperties}>
                {cubeColumns.map((i) => (
                  <span key={i} style={{ "--i": i } as React.CSSProperties}></span>
                ))}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default MultiCubeLoader;
