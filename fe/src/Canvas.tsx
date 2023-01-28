import React, { useRef, useState, useEffect } from "react";
import { Hands, Results, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import "./Canvas.scss";

function onResults(
  cx: CanvasRenderingContext2D,
  cvs: HTMLCanvasElement,
  results: Results
) {
  console.log("updating results");
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

export default function Canvas() {
  const cvs = useRef<HTMLCanvasElement | null>(null);
  const vid = useRef<HTMLVideoElement | null>(null);
  const cx = useRef<CanvasRenderingContext2D | null>(null);
  const hands = useRef<Hands | null>(null);
  const cam = useRef<Camera | null>(null);

  useEffect(() => {
    if (cvs.current === null || vid.current === null) {
      throw Error("oh no");
    }

    cx.current = cvs.current?.getContext("2d") ?? null;

    // hands.current = new Hands({});

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
      console.log("onResult");
      if (cx.current && cvs.current) {
        onResults(cx.current, cvs.current, r);
      }
    });

    cam.current = new Camera(vid.current, {
      onFrame: async () => {
        await hands.current!.send({ image: vid.current! });
        console.log("onFrame");
      },
      width: 1280,
      height: 720,
    });
    cam.current!.start();
  }, []);

  return (
    <div className="Canvas">
      <video style={{ display: "none" }} className="input_video" ref={vid} />
      <canvas
        className="output_canvas"
        width="1280px"
        height="720px"
        ref={cvs}
      />
    </div>
  );
}
