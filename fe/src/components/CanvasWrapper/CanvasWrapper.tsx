import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref, Props as CanvasProps } from "../Canvas/Canvas";

type Props = {
  width: number;
  height: number;
  onRecordEnd: CanvasProps["onRecordEnd"];
};

function CanvasWrapper_(
  { width, height, onRecordEnd }: Props,
  ref: ForwardedRef<Ref>
) {
  return (
    <div>
      <Canvas width={width} height={height} {...{ ref, onRecordEnd }} />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
