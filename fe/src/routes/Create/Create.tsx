import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import {
  faPen,
  faEraser,
  faShapes,
  faPalette,
  faCopy,
  faPaste,
} from "@fortawesome/free-solid-svg-icons";
import { convertTime } from "../../utils";

import Modal from "../../components/Modal/Modal";
import Tool from "../../components/Tool/Tool";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

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

  const [actionChange, setActionChange] = useState("");

  const updateShowTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  const updateShowPublish = () => {
    setShowPublish(!showPublish);
  };

  const publish = () => {
    updateShowPublish();
  };

  const start = () => {};

  const restart = () => {};

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
        <div
          className={styles.actionContainer}
          data-active={actionChange !== ""}
        >
          <p className={styles.action}>{actionChange}</p>
        </div>
        <div className={styles.canvas}></div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.artNameContainer}>
          <Input
            value={artName}
            setValue={setArtName}
            placeholder="Your art name..."
          />
        </div>
        <div className={styles.canvasOption}>
          <p>{}</p>
          <Button name="Start" isPressed={false} onClick={start} />
          <Button name="Restart" isPressed={false} onClick={restart} />
          <Button name="Publish" isPressed={false} onClick={publish} />
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
