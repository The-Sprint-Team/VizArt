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

export default function Create() {
  const [artName, setArtName] = useState(convertTime(new Date()));
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const [actionChange, setActionChange] = useState("");

  const ref = useRef<CanvasRef>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startRecording = () => ref.current?.start();
  const stopRecording = () => ref.current?.stop();
  const onRecordEnd = (b: Blob, thumb: string) => {
    api.uploadFile(artName, b, thumb).then(console.log).catch(console.error);
  };

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
          data-active={actionChange !== ""}
        >
          <p className={styles.action}>{actionChange}</p>
        </div>
        <div className={styles.canvas} ref={canvasRef}>
          {canvasRef.current && (
            <CanvasWrapper
              width={canvasRef.current.clientWidth}
              height={canvasRef.current.clientHeight}
              ref={ref}
              onRecordEnd={onRecordEnd}
            />
          )}
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
      <Modal isVisible={showTutorial} width={300} height={400}>
        <>
          <h1>This is a test</h1>
          <p>Put all the content you want in here</p>
          <Button name="Close" isPressed={false} onClick={updateShowTutorial} />
        </>
      </Modal>
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
