import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import {
  Hands,
  Results,
  HAND_CONNECTIONS,
  NormalizedLandmarkList,
  Landmark,
} from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import {
  drawLandmarks,
  drawConnectors,
  NormalizedLandmark,
} from "@mediapipe/drawing_utils";
import styles from "./style.module.scss";

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
enum Action {
  Erase,
  Draw,
  None,
}

let points: [[number, number], [number, number]][] = [];
let prev: any = null;

function distP(
  p1: [number, number],
  p2: Landmark,
  cvs: HTMLCanvasElement
): number {
  console.log(p1, p2);
  let vec = [p1[0] - p2.x * cvs.width, p1[1] - p2.y * cvs.height];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return mag;
}

function dist(l1: Landmark, l2: Landmark): number {
  let vec = [l1.x - l2.x, l1.y - l2.y];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return mag;
}

function vecNorm(l1: Landmark, l2: Landmark): number[] {
  let vec = [l1.x - l2.x, l1.y - l2.y];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return [vec[0] / mag, vec[1] / mag];
}

function ang(v1: number[], v2: number[]): number {
  return Math.acos(v1[0] * v2[0] + v1[1] * v2[1]);
}

function isStraight(hList: NormalizedLandmarkList[], f: number): boolean {
  const a0 = ang(
    vecNorm(hList[f][1], hList[f][0]),
    vecNorm(hList[f][2], hList[f][1])
  );
  const a1 = ang(
    vecNorm(hList[f][2], hList[f][1]),
    vecNorm(hList[f][3], hList[f][2])
  );
  const a2 = ang(
    vecNorm(hList[f][2], hList[f][1]),
    vecNorm(hList[f][3], hList[f][2])
  );

  return Math.abs(a0 - a1) < Math.PI / 15 && Math.abs(a2 - a1) < Math.PI / 15;
}

function onResults(
  cx: CanvasRenderingContext2D,
  cvs: HTMLCanvasElement,
  res: Results
) {
  cx.save();
  cx.clearRect(0, 0, cvs.width, cvs.height);
  cx.drawImage(res.image, 0, 0, cvs.width, cvs.height);
  cx.lineJoin = "round";
  cx.strokeStyle = "black";
  cx.lineWidth = 5;
  const r: NormalizedLandmarkList[] = [],
    l: NormalizedLandmarkList[] = [];

  for (let k in res.multiHandedness) {
    const h = res.multiHandedness[k];
    const hList = h.label === "Right" ? r : l;
    for (let i = 0; i < 5; ++i) {
      hList[i] = res.multiHandLandmarks[k].slice(4 * i + 1, 4 * i + 5);
    }

    // draw finger
    const d1 = dist(hList[1][3], hList[2][3]);
    const d2 = dist(hList[2][3], hList[2][0]);
    if (isStraight(hList, 1) && d1 > d2) {
      let next: [number, number] = [
        hList[1][3].x * cvs.width,
        hList[1][3].y * cvs.height,
      ];
      if (prev) {
        points.push([prev, next]);
      }
      prev = next;
    } else {
      prev = null;
    }

    let radius: number = 40;
    // erase
    if (
      isStraight(hList, 1) &&
      isStraight(hList, 2) &&
      isStraight(hList, 3) &&
      isStraight(hList, 4)
    ) {
      console.log("JIJIJ");
      cx.beginPath();
      cx.arc(
        hList[2][3].x * cvs.width,
        hList[2][3].y * cvs.height,
        radius,
        0,
        2 * Math.PI
      );
      cx.stroke();

      let i = points.length;
      while (i--) {
        if (
          distP(points[i][0], hList[2][3], cvs) < radius ||
          distP(points[i][1], hList[2][3], cvs) < radius
        ) {
          // console.log("JIJIJ")
          points.splice(i, 1);
        }
      }
    }
  }
  // console.log(results)

  cx.beginPath();
  for (const seg of points) {
    cx.moveTo(seg[0][0], seg[0][1]);
    cx.lineTo(seg[1][0], seg[1][1]);
  }
  cx.stroke();

  if (res.multiHandLandmarks) {
    for (const landmarks of res.multiHandLandmarks) {
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
    <div className={styles.canvas}>
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
