import { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import {
  faPen,
  faEraser,
  faShapes,
  faPalette,
  faCopy,
  faPaste,
} from "@fortawesome/free-solid-svg-icons";
import { convertTime, secondsToMinutesSeconds } from "../../utils";

import Modal from "../../components/Modal/Modal";
import Tool from "../../components/Tool/Tool";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import CanvasWrapper from "../../components/CanvasWrapper/CanvasWrapper";

import { Ref as CanvasRef } from "../../components/Canvas/Canvas";
import api from "../../api";
import Tutorial from "../../components/Tutorial/Tutorial";
import TutorialBlock from "../../components/TutorialBlock/TutorialBlock";

type Tool = {
  name: string;
  icon: FontAwesomeIconProps["icon"];
  trigger?: () => void;
};

const tools: Tool[] = [
  { name: "Pen", icon: faPen },
  { name: "Eraser", icon: faEraser },
  { name: "Shape", icon: faShapes },
  { name: "Color", icon: faPalette },
  { name: "Copy", icon: faCopy },
  { name: "Paste", icon: faPaste },
];

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

export default function Create() {
  const [artName, setArtName] = useState(convertTime(new Date()));
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const [actionChange, setActionChange] = useState<Event>();

  const ref = useRef<CanvasRef>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startRecording = () => ref.current?.start();
  const stopRecording = () => ref.current?.stop();
  const onRecordEnd = (b: Blob, thumb: string) => {
    api.uploadFile(artName, b, thumb).then(console.log).catch(console.error);
  };

  const [onStartDraw, setOnStartDraw] = useState<Event>();
  const [onStopDraw, setOnStopDraw] = useState<Event>();
  const [onStartErase, setOnStartErase] = useState<Event>();
  const [onStopErase, setOnStopErase] = useState<Event>();
  const [onStartColorPicker, setOnStartColorPicker] = useState<Event>();
  const [onStopColorPicker, setOnStopColorPicker] = useState<Event>();

  const interval = useRef<NodeJS.Timeout>();

  const updateShowTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  const updateShowPublish = () => {
    setShowPublish(!showPublish);
  };

  const onPublish = () => {
    updateShowPublish();
    //publish
  };

  const onStart = () => {
    startRecording();
    setIsStarted(true);
    interval.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const onRestart = () => {
    stopRecording();
    setIsStarted(false);
    setTime(0);
    clearInterval(interval.current);
  };

  useEffect(() => {
    if (onStartDraw) {
      setActionChange({ a: onStartDraw.a, d: onStartDraw.d });
    }
  }, [onStartDraw]);

  useEffect(() => {
    if (onStopDraw) {
      setActionChange({ a: onStopDraw.a, d: onStopDraw.d });
    }
  }, [onStopDraw]);

  useEffect(() => {
    if (onStartErase) {
      setActionChange({ a: onStartErase.a, d: onStartErase.d });
    }
  }, [onStartErase]);

  useEffect(() => {
    if (onStopErase) {
      setActionChange({ a: onStopErase.a, d: onStopErase.d });
    }
  }, [onStopErase]);

  useEffect(() => {
    if (onStartColorPicker) {
      setActionChange({ a: onStartColorPicker.a, d: onStartColorPicker.d });
    }
  }, [onStartColorPicker]);

  useEffect(() => {
    // if (onStartDraw?.e) {
    //   setActionChange({ a: onStartDraw.e.a, d: onStartDraw.e.d });
    // }
  }, [onStopColorPicker]);

  return (
    <div className={styles.container}>
      {/* Loop trough tools */}
      <div className={styles.topBar}>
        <div className={styles.toolContainer}>
          {tools.map((tool, index) => {
            return (
              <Tool
                name={tool.name}
                icon={tool.icon}
                isActive={false}
                key={index}
              />
            );
          })}
        </div>
        <Button
          name="Tutorial"
          isPressed={false}
          onClick={updateShowTutorial}
        />
      </div>

      <div className={styles.canvasContainer}>
        {time > 0 && time % 2 === 0 && (
          <div className={styles.recordingCircle} />
        )}
        <div
          className={styles.actionContainer}
          // data-active={actionChange !== ""}
        >
          <h1 className={styles.action}>{actionChange?.a.toString()}</h1>
        </div>
        <div className={styles.canvas} ref={canvasRef}>
          {/* {canvasRef.current && ( */}
          <CanvasWrapper
            onStartDraw={setOnStartDraw}
            onStopDraw={setOnStopDraw}
            onStartErase={setOnStartErase}
            onStopErase={setOnStopErase}
            onStartColorPicker={setOnStartColorPicker}
            onStopColorPicker={setOnStopColorPicker}
            width={800} //canvasRef.current.clientHeight
            height={500}
            ref={ref}
            onRecordEnd={onRecordEnd}
          />
          {/* )} */}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <Input
          value={artName}
          setValue={setArtName}
          placeholder="Your art name..."
        />
        <div className={styles.canvasOptions}>
          <p>{secondsToMinutesSeconds(time)}</p>
          <Button
            name={isStarted ? "Restart" : "Start"}
            isPressed={false}
            onClick={isStarted ? onRestart : onStart}
            width={100}
          />
          <Button name="Publish" isPressed={false} onClick={onPublish} />
        </div>
      </div>

      <Tutorial isVisible={showTutorial} width={800} height={600}>
        <>
          <h1>Tutorial</h1>
          <Button name="Close" isPressed={false} onClick={updateShowTutorial} />
          <h2> Learn to draw in the air</h2>
          <TutorialBlock
            title="Draw"
            description="draw with your finger tip"
            image=""
          />
          <TutorialBlock
            title="Erase"
            description="draw with your finger tip"
            image=""
          />
          <TutorialBlock
            title="Color Pick"
            description="draw with your finger tip"
            image=""
          />
          <TutorialBlock
            title="Copy"
            description="draw with your finger tip"
            image=""
          />
          <TutorialBlock
            title="Paste"
            description="draw with your finger tip"
            image=""
          />
          <TutorialBlock
            title="Record"
            description="draw with your finger tip"
            image=""
          />
        </>
      </Tutorial>

      <Modal isVisible={showPublish} width={400} height={400}>
        <>
          <h1>This is a publish</h1>
          <p>Put all the content you want in here</p>
          <Button name="Close" isPressed={false} onClick={updateShowPublish} />
        </>
      </Modal>
    </div>
  );
}
