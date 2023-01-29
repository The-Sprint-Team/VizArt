import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref } from "../Canvas/Canvas";

type Props = {
  start: () => any;
  stop: () => any;
  pause: () => any;
  onRecordEnd: (data: Blob) => any;
};

function CanvasWrapper_(
  { start, stop, pause, onRecordEnd }: Props,
  ref: ForwardedRef<Ref>
) {
  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={pause}>Pause</button>
      <Canvas width={1280} height={720} {...{ ref, onRecordEnd }} />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
