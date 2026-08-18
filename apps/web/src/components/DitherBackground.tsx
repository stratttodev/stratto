import { Dithering } from "@paper-design/shaders-react";

export function DitherBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Dithering
        colorBack="#202920"
        colorFront="#176d41"
        shape="simplex"
        type="4x4"
        size={2}
        speed={0.55}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}