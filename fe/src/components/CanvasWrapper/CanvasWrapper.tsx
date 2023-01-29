import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref, Props } from "../Canvas/Canvas";
export { Action } from "../Canvas/Canvas";
export type { Props, Ref, ActionChange } from "../Canvas/Canvas";

function CanvasWrapper_(props: Props, ref: ForwardedRef<Ref>) {
  return (
    <div>
      <Canvas {...props} ref={ref} />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
