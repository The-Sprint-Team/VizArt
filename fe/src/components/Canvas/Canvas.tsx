// TODO: COPY PASTE
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
  onRecordEnd?: (vid: Blob, b64thumb: string) => any;
  onActionChange: (e: ActionChange) => any;
}

export interface Ref {
  start: () => void;
  pause: () => void;
  stop: () => void;
}

export type ActionChange = {
  a: Action;
  d: string;
};

export enum Action {
  None = "None",
  Pen = "Pen",
  Eraser = "Eraser",
  Color = "Color",
  Clear = "Clear",
  Generate = "Generate",
}

let points: [[number, number], [number, number], string][] = []; // [x, y, color][]
let prevR: any = null;
let prevL: any = null;
let cp: boolean = false,
  cpm: boolean = false,
  cpmm: boolean = false;
let color: string = "black";
let left = 5000,
  right = 0,
  top = 5000,
  bot = 0;
let draw = false,
  erase = false,
  colorPicker = false,
  fku: boolean = false;

function distP(
  p1: [number, number],
  p2: NormalizedLandmark,
  cvs: HTMLCanvasElement
): number {
  // console.log(p1, p2)
  let vec = [p1[0] - p2.x * cvs.width, p1[1] - p2.y * cvs.height];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return mag;
}

function dist(l1: NormalizedLandmark, l2: NormalizedLandmark): number {
  let vec = [l1.x - l2.x, l1.y - l2.y];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return mag;
}

function vecNorm(l1: NormalizedLandmark, l2: NormalizedLandmark): number[] {
  let vec = [l1.x - l2.x, l1.y - l2.y];
  let mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
  return [vec[0] / mag, vec[1] / mag];
}

function ang(v1: number[], v2: number[]): number {
  return Math.acos(v1[0] * v2[0] + v1[1] * v2[1]);
}

function isStraight(
  hList: NormalizedLandmarkList[],
  f: number,
  bar: number
): boolean {
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

  return Math.abs(a0 - a1) < bar && Math.abs(a2 - a1) < bar;
}

function isPerp(
  l11: NormalizedLandmark,
  l12: NormalizedLandmark,
  l21: NormalizedLandmark,
  l22: NormalizedLandmark
): boolean {
  const a0 = ang(vecNorm(l11, l12), vecNorm(l21, l22));

  return Math.abs(a0) < Math.PI / 4;
}

function onResults(
  cx: CanvasRenderingContext2D,
  cvs: HTMLCanvasElement,
  res: Results,
  onActionChange: (e: ActionChange) => any
) {
  cx.restore();
  cx.clearRect(0, 0, cvs.width, cvs.height);
  cx.drawImage(res.image, 0, 0, cvs.width, cvs.height);
  const ONESEVENTH = 0.15;
  const RADIUS = 25;
  cx.beginPath();
  cx.fillStyle = "violet";
  cx.arc(
    0.125 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "indigo";
  cx.arc(
    0.25 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "blue";
  cx.arc(
    0.375 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "green";
  cx.arc(
    0.5 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "yellow";
  cx.arc(
    0.625 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "orange";
  cx.arc(
    0.75 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.beginPath();
  cx.fillStyle = "red";
  cx.arc(
    0.875 * cvs.width,
    (1 - ONESEVENTH) * cvs.height,
    RADIUS,
    0,
    Math.PI * 2
  );
  cx.fill();
  cx.lineJoin = "round";
  cx.lineWidth = 5;
  const r: NormalizedLandmarkList[] = [],
    l: NormalizedLandmarkList[] = [];

  if (res.multiHandedness.length === 0) {
    prevR = null;
    prevL = null;
    if (!draw && !erase && !colorPicker && !fku) {
      onActionChange({ a: Action.None, d: "" });
    }
  }
  for (let k in res.multiHandedness) {
    const h = res.multiHandedness[k];
    const hList = h.label === "Right" ? r : l;
    for (let i = 0; i < 5; ++i) {
      hList[i] = res.multiHandLandmarks[k].slice(4 * i + 1, 4 * i + 5);
    }

    // draw finger
    if (
      isStraight(hList, 1, Math.PI / 15) &&
      !isPerp(hList[1][2], hList[1][3], hList[2][2], hList[2][3]) &&
      !isPerp(hList[1][2], hList[1][3], hList[3][2], hList[3][3]) &&
      !isPerp(hList[1][2], hList[1][3], hList[4][2], hList[4][3])
    ) {
      onActionChange({ a: Action.Pen, d: "" });
      draw = true;
      let next: [number, number] = [
        hList[1][3].x * cvs.width,
        hList[1][3].y * cvs.height,
      ];
      if (h.label === "Right") {
        if (prevR) {
          points.push([prevR, next, cp ? "cyan" : (" " + color).slice(1)]);
        }
        prevR = next;
      }
      if (h.label === "Left") {
        if (prevL) {
          points.push([prevL, next, cp ? "cyan" : (" " + color).slice(1)]);
        }
        prevL = next;
      }
    } else {
      if (h.label === "Right") {
        prevR = null;
      }
      if (h.label === "Left") {
        prevL = null;
      }
    }

    // erase
    let radius: number = 40;
    let eraseBar: number = Math.PI / 20;
    let allStraight: boolean = true,
      allAbove: Boolean = true;
    for (let i = 1; i < 5; ++i) {
      if (!isStraight(hList, i, eraseBar)) {
        allStraight = false;
      }
      if (hList[i][3].y > hList[i][2].y) {
        allAbove = false;
      }
    }
    if (allStraight && allAbove) {
      onActionChange({ a: Action.Eraser, d: "" });
      erase = true;
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
          points.splice(i, 1);
        }
      }
    }

    // color picker
    const dc1 = dist(hList[1][3], hList[0][3]);
    const dc2 = dist(hList[1][3], hList[1][2]);
    const dc3 = dist(hList[0][3], hList[0][2]);

    let left = hList[1][3].x * cvs.width;
    let left_ = left;
    let right = hList[1][0].x * cvs.width;
    left = (left + (left_ + right) / 2) / 2;
    right = (right + (left_ + right) / 2) / 2;
    left_ = left;
    left = (left + (left_ + right) / 2) / 2;
    right = (right + (left_ + right) / 2) / 2;
    const wi = Math.abs(right - left);
    let top = hList[1][1].y * cvs.height;
    let top_ = top;
    let bot = hList[0][1].y * cvs.height;
    top = (top + (top_ + bot) / 2) / 2;
    bot = (bot + (top_ + bot) / 2) / 2;
    top_ = top;
    const he = Math.abs(bot - top);

    if ((dc1 < dc2 || dc1 < dc3) && wi > 1 && he > 1) {
      onActionChange({ a: Action.Color, d: color });
      colorPicker = true;
      cx.strokeStyle = "black";
      cx.strokeRect(left - 2, top + 2, wi + 4, he + 4);
      const imageData = cx.getImageData(left, top, wi, he);
      let rSum = 0,
        gSum = 0,
        bSum = 0,
        aSum = 0;
      const l = imageData.data.length;
      for (let i = 0; i < l; i += 4) {
        rSum += imageData.data[i + 0];
        gSum += imageData.data[i + 1];
        bSum += imageData.data[i + 2];
        aSum += imageData.data[i + 3];
      }
      const r = (rSum * 4) / l;
      const g = (gSum * 4) / l;
      const b = (bSum * 4) / l;
      const a = (aSum * 4) / l;
      color = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // fk u
    if (
      (isStraight(hList, 2, Math.PI / 15) &&
        !isPerp(hList[2][2], hList[2][3], hList[1][2], hList[1][3]) &&
        !isPerp(hList[2][2], hList[2][3], hList[3][2], hList[3][3]) &&
        !isPerp(hList[2][2], hList[2][3], hList[4][2], hList[4][3]) &&
        hList[2][3].y - hList[2][1].y < 0) ||
      (isStraight(hList, 4, Math.PI / 15) &&
        !isPerp(hList[4][2], hList[4][3], hList[1][2], hList[1][3]) &&
        !isPerp(hList[4][2], hList[4][3], hList[2][2], hList[2][3]) &&
        !isPerp(hList[4][2], hList[4][3], hList[3][2], hList[3][3]) &&
        hList[4][3].y - hList[4][1].y < 0)
    ) {
      onActionChange({ a: Action.Clear, d: "fk u" });
      fku = true;
      points = [];
    }

    if (!draw && !erase && !colorPicker && !fku) {
      onActionChange({ a: Action.None, d: "" });
    }
    draw = false;
    erase = false;
    colorPicker = false;
    fku = false;
  }

  // copy paste
  if (res.multiHandedness.length === 2) {
    // let r = res.multiHandedness[0].label === "Right" ? 0 : 1;
    // let l = 1 - r;
    const eps1 = 0.01;
    const eps2 = 0.04;
    const eps3 = 0.1;
    let dc = dist(res.multiHandLandmarks[0][8], res.multiHandLandmarks[1][8]);
    let dc1 = dist(
      res.multiHandLandmarks[0][12],
      res.multiHandLandmarks[1][12]
    );
    // console.log(dc);
    if (dc < eps1) {
      if (dc1 > eps3) {
        cp = true;
      }
    }
    if (cp && dc > eps2) {
      cpm = true;
    }
    // console.log(cp, cpm);
    if (cp && cpm && dc < eps1) {
      for (const seg of points) {
        if (seg[2] === "cyan") {
          // console.log(seg[0][0]);
          left = Math.min(left, seg[0][0]);
          left = Math.min(left, seg[1][0]);
          right = Math.max(right, seg[0][0]);
          right = Math.max(right, seg[1][0]);
          top = Math.min(top, seg[0][1]);
          top = Math.min(top, seg[1][1]);
          bot = Math.max(bot, seg[0][1]);
          bot = Math.max(bot, seg[1][1]);
        }
      }
      cpmm = true;
    }
    if (cpm && cpmm) {
      cx.strokeStyle = "cyan";
      cx.strokeRect(left, top, Math.abs(right - left), Math.abs(top - bot));
      cx.stroke();
    }
    console.log(left, right, top, bot);
    if (cp && cpm && cpmm && dc > eps2) {
      console.log(left, right, top, bot);
      cp = false;
      cpm = false;
      cpmm = false;
      left = 5000;
      right = 0;
      top = 5000;
      bot = 0;
    }
  }

  // console.log(res)
  // draw
  for (const seg of points) {
    cx.strokeStyle = seg[2];
    cx.beginPath();
    cx.moveTo(seg[0][0], seg[0][1]);
    cx.lineTo(seg[1][0], seg[1][1]);
    cx.stroke();
  }

  if (res.multiHandLandmarks) {
    for (const landmarks of res.multiHandLandmarks) {
      drawConnectors(cx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(cx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }
  cx.save();
}

function Canvas_(
  { width, height, onActionChange, onRecordEnd }: Readonly<Props>,
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
        onResults(cx.current, cvs.current, r, onActionChange);
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

    const cx_ = cx.current;
    const cvs_ = cvs.current;
    rec.current!.ondataavailable = (e: BlobEvent) => {
      const data = cvs_.toDataURL("image/png");
      const b64 = data.replace(/^data:image\/png;base64,/, "");
      onRecordEnd?.(e.data, b64);
    };
  }, []);

  return (
    <div className={styles.container}>
      <video
        style={{ display: "none", borderRadius: 5 }}
        className="input_video"
        ref={vid}
      />
      <canvas
        className={styles.canvas}
        width={`${width}px`}
        height={`${height}px`}
        ref={cvs}
      />
    </div>
  );
}

const Canvas = forwardRef<Ref, Props>(Canvas_);
export default Canvas;
