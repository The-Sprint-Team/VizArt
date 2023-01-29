import { ForwardedRef, forwardRef } from "react";
import Canvas, { Ref, Props as CanvasProps } from "../Canvas/Canvas";

type Event = {
  a: Action;
  d: string;
};

enum Action {
    None,
    Draw,
    Erase,
    ColorPicker,
}

type Props = {
  width: number;
  height: number;
  onRecordEnd: CanvasProps["onRecordEnd"];
  onDraw: (e: Event) => void;
  onErase: (e: Event) => void;
  onColorPicker: (e: Event) => void;
  onNone: (e: Event) => void;
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
        width={width}
        height={height}
        {...{ ref, onRecordEnd }}
      />
    </div>
  );
}

const CanvasWrapper = forwardRef<Ref, Props>(CanvasWrapper_);
export default CanvasWrapper;
