import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import { Hands, Results, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import "./Canvas.scss";

export interface Props {
  width: number;
  height: number;
  onRecordEnd?: (data: Blob) => any;
}

export interface Ref {
  start: () => void;
  pause: () => void;
  stop: () => void;
}

function onResults(
  cx: CanvasRenderingContext2D,
  cvs: HTMLCanvasElement,
  results: Results
) {
  cx.save();
  cx.clearRect(0, 0, cvs.width, cvs.height);
  cx.drawImage(results.image, 0, 0, cvs.width, cvs.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(cx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(cx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }
  cx.restore();
}

function Canvas_(
  { width, height, onRecordEnd }: Readonly<Props>,
  ref: ForwardedRef<Ref>
) {
  const cvs = useRef<HTMLCanvasElement | null>(null);
  const vid = useRef<HTMLVideoElement | null>(null);
  const cx = useRef<CanvasRenderingContext2D | null>(null);
  const hands = useRef<Hands | null>(null);
  const cam = useRef<Camera | null>(null);
  const rec = useRef<MediaRecorder | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        rec.current?.start();
      },
      stop: () => {
        rec.current?.stop();
      },
      pause: () => {
        rec.current?.pause();
      },
    }),
    [rec]
  );

  // Initial setup sequence.
  useEffect(() => {
    if (cvs.current === null || vid.current === null) {
      throw Error("unreachable");
    }

    cx.current = cvs.current?.getContext("2d") ?? null;

    hands.current = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
      },
    });

    hands.current!.setOptions({
      selfieMode: true,
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.current!.onResults((r) => {
      if (cx.current && cvs.current) {
        onResults(cx.current, cvs.current, r);
      }
    });

    cam.current = new Camera(vid.current, {
      onFrame: async () => {
        await hands.current!.send({ image: vid.current! });
      },
      width,
      height,
    });

    cam.current!.start();

    rec.current = new MediaRecorder(cvs.current!.captureStream(30), {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: "video/webm",
    });

    rec.current!.ondataavailable = (e: BlobEvent) => onRecordEnd?.(e.data);
  }, []);

  return (
    <div className="Canvas">
      <video style={{ display: "none" }} className="input_video" ref={vid} />
      <canvas
        className="output_canvas"
        width={`${width}px`}
        height={`${height}px`}
        ref={cvs}
      />
    </div>
  );
}

const Canvas = forwardRef<Ref, Props>(Canvas_);
export default Canvas;
