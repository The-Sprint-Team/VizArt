import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref, Props as CanvasProps, Event as EventThing } from "../Canvas/Canvas";

type Props = {
  width: number;
  height: number;
  onRecordEnd: CanvasProps["onRecordEnd"];
  onDraw: (e: EventThing) => void;
  onErase: (e: EventThing) => void;
  onColorPicker: (e: EventThing) => void;
  onNone: (e: EventThing) => void;
  onFkU: (e: EventThing) => void;
};

function CanvasWrapper_(
  {
    width,
    height,
    onRecordEnd,
    onDraw,
    onErase,
    onColorPicker,
    onNone,
    onFkU,
  }: Props,
  ref: ForwardedRef<Ref>
) {
  return (
    <div>
      <Canvas
        onDraw={onDraw}
        onErase={onErase}
        onColorPicker={onColorPicker}
        onNone={onNone}
        onFkU={onFkU}
        width={width}
        height={height}
        {...{ ref, onRecordEnd }}
      />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
