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

export default function Create() {
  const ref = useRef<CanvasRef>(null);
  const start = () => ref.current?.start();
  const stop = () => ref.current?.stop();
  const pause = () => ref.current?.pause();
  const onRecordEnd = (b: Blob) => {
    api.uploadFile("DEFAULT NAME", b).then(console.log).catch(console.error);
  };

  const [artName, setArtName] = useState(convertTime(new Date()));
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [time, setTime] = useState(0);

  const [actionChange, setActionChange] = useState("");

  const updateShowTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  const updateShowPublish = () => {
    setShowPublish(!showPublish);
  };

  const onPublish = () => {
    updateShowPublish();
  };

  const onStart = () => {};

  const onRestart = () => {};

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
      {/* 
      <div className={styles.canvasContainer}>
        <div
          className={styles.actionContainer}
          data-active={actionChange !== ""}
        >
          <p className={styles.action}>{actionChange}</p>
        </div>
        <div className={styles.canvas}></div>
      </div> */}

      <CanvasWrapper
        ref={ref}
        start={start}
        stop={stop}
        pause={pause}
        onRecordEnd={onRecordEnd}
      />

      <div className={styles.bottomBar}>
        <Input
          value={artName}
          setValue={setArtName}
          placeholder="Your art name..."
        />
        <div className={styles.canvasOptions}>
          <p>{secondsToMinutesSeconds(time)}</p>
          <Button name="Start" isPressed={false} onClick={onStart} />
          <Button name="Restart" isPressed={false} onClick={onRestart} />
          <Button name="Publish" isPressed={false} onClick={onPublish} />
        </div>
      </div>

      <Tutorial isVisible={showTutorial} width={1000} height={800}>
        <>
          <h1>Tutorial</h1>
          <Button name="Close" isPressed={false} onClick={updateShowTutorial} />
          <h2> Learn to draw in the air</h2>  
          <TutorialBlock title="Draw" description="draw with your finger tip" image="" />
          <TutorialBlock title="Erase" description="draw with your finger tip" image="" />
          <TutorialBlock title="Color Pick" description="draw with your finger tip" image="" />
          <TutorialBlock title="Copy" description="draw with your finger tip" image="" />
          <TutorialBlock title="Paste" description="draw with your finger tip" image="" />
          <TutorialBlock title="Record" description="draw with your finger tip" image="" />
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
