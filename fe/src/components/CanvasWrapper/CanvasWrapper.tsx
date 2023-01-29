import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref, Props as CanvasProps } from "../Canvas/Canvas";

type Event = {
  a: Action;
  d: string;
};

enum Action {
  StartErase,
  StopErase,
  StartDraw,
  StopDraw,
  StartColorPicker,
  StopColorPicker,
}

type Props = {
  width: number;
  height: number;
  onRecordEnd: CanvasProps["onRecordEnd"];
  onStartDraw: (e: Event) => void;
  onStopDraw: (e: Event) => void;
  onStartErase: (e: Event) => void;
  onStopErase: (e: Event) => void;
  onStartColorPicker: (e: Event) => void;
  onStopColorPicker: (e: Event) => void;
};

function CanvasWrapper_(
  {
    width,
    height,
    onRecordEnd,
    onStartDraw,
    onStopDraw,
    onStartErase,
    onStopErase,
    onStartColorPicker,
    onStopColorPicker,
  }: Props,
  ref: ForwardedRef<Ref>
) {
  return (
    <div>
      <Canvas
        onStartDraw={onStartDraw}
        onStopDraw={onStopDraw}
        onStartErase={onStartErase}
        onStopErase={onStopErase}
        onStartColorPicker={onStartColorPicker}
        onStopColorPicker={onStopColorPicker}
        width={width}
        height={height}
        {...{ ref, onRecordEnd }}
      />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
