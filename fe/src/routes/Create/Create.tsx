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
import CanvasWrapper, {
  Ref as CanvasRef,
  ActionChange,
  Action,
} from "../../components/CanvasWrapper/CanvasWrapper";
import SizeCap from "../../components/SizeCap/SizeCap";
import Loader from "../../components/Loader/Loader";

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

type Props = {
  forcedTitle?: string;
};

const maxTime = 60;

export default function Create({ forcedTitle }: Props) {
  const [artName, setArtName] = useState(forcedTitle ? forcedTitle : "");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCompetitionRule, setShowCompetitionRule] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [actionChange, setActionChange] = useState<ActionChange>({
    a: Action.None,
    d: "",
  });
  const [vid, setVid] = useState<{ b: Blob; thumb: string } | null>(null);

  const ref = useRef<CanvasRef>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startRecording = () => ref.current?.start();
  const stopRecording = () => ref.current?.stop();
  const onRecordEnd = (b: Blob, thumb: string) => {
    setVid({ b, thumb });
  };

  const interval = useRef<NodeJS.Timer>();

  const updateShowTutorial = () => {
    if (!showTutorial) {
      //prevent scroll on body
      document.body.style.overflow = "hidden";
    } else {
      //allow scroll on body
      document.body.style.overflow = "auto";
    }
    setShowTutorial(!showTutorial);
  };

  const updateShowCompetition = () => {
    if (!showCompetitionRule) {
      //prevent scroll on body
      document.body.style.overflow = "hidden";
    } else {
      //allow scroll on body
      document.body.style.overflow = "auto";
    }
    setShowCompetitionRule(!showCompetitionRule);
  };

  const updateShowPublish = () => {
    if (!showPublish) {
      //prevent scroll on body
      document.body.style.overflow = "hidden";
    } else {
      //allow scroll on body
      document.body.style.overflow = "auto";
    }
    setShowPublish(!showPublish);
  };

  const onPublish = () => {
    updateShowPublish();
    if (vid !== null) {
      api
        .uploadFile(artName, vid.b, vid.thumb)
        .then(console.log)
        .catch(console.error);
    }
  };

  const onStart = () => {
    startRecording();
    setIsStarted(true);
    interval.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const resetDrawing = () => {};

  const onStop = () => {
    stopRecording();
    setIsStarted(false);
    setTime(0);
    clearInterval(interval.current);
  };

  useEffect(() => {
    if (forcedTitle) {
      updateShowCompetition();
    } else {
      updateShowTutorial();
    }
  }, []);

  useEffect(() => {
    //reset page
    if (forcedTitle) {
      setArtName(forcedTitle);
      setShowCompetitionRule(true);
      setShowTutorial(false);
    } else {
      setArtName("");
      setShowCompetitionRule(false);
      setShowTutorial(true);
    }
    setActionChange({ a: Action.None, d: "" });
    setIsStarted(false);
    setTime(0);
    clearInterval(interval.current);
    resetDrawing();
  }, [forcedTitle]);

  const onActionChange = (e: ActionChange) => {
    setActionChange(e);
  };

  return (
    <div className={styles.container}>
      <SizeCap width={768}>
        {/* Loop trough tools */}
        <div className={styles.topBar}>
          <div className={styles.toolContainer}>
            {tools.map((tool, index) => {
              return (
                <Tool
                  name={tool.name}
                  icon={tool.icon}
                  isActive={tool.name === actionChange.a}
                  key={index}
                />
              );
            })}
          </div>
          <div>
            {forcedTitle && (
              <Button
                name="Competition Rules"
                isPressed={false}
                onClick={updateShowCompetition}
              />
            )}
            <Button
              name="Tutorial"
              isPressed={false}
              onClick={updateShowTutorial}
            />
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <div className={styles.canvas} ref={canvasRef}>
            {isStarted && <div className={styles.recordingCircle} />}
            <div
              className={styles.actionContainer}
              // data-active={actionChange !== ""}
            >
              {/* <h1 className={styles.action}>{actionChange?.a.toString()}</h1> */}
            </div>

            {canvasRef.current && (
              <CanvasWrapper
                onActionChange={onActionChange}
                width={canvasRef.current.clientWidth} //canvasRef.current.clientHeight
                height={(canvasRef.current.clientWidth * 9) / 16}
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
            isLocked={forcedTitle ? true : false}
          />
          <div className={styles.canvasOptions}>
            <p>{secondsToMinutesSeconds(time)}</p>
            <Button
              name={isStarted ? "Stop" : "Start"}
              isPressed={false}
              onClick={isStarted ? onStop : onStart}
              width={100}
            />
            <Button
              name="Publish"
              isPressed={false}
              onClick={onPublish}
              disabled={vid === null || artName === ""}
            />
          </div>
        </div>

        <Tutorial isVisible={showTutorial} width={400} height={600}>
          <div className={styles.tutContainer}>
            <div className={styles.tutContent}>
              <h1 className={styles.tutTitle}>Learn to draw in the air!</h1>

              <h2 className={styles.tutSubtitle}>
                Follow this quick guide to learn to draw in VizArt AI
              </h2>

              <TutorialBlock
                title="Draw"
                description="Draw with your finger tips straight!"
                image="demoDraw.png"
              />
              <hr />
              <TutorialBlock
                title="Nothing"
                description="Qqueeze fist for no actions"
                image="demoNothing.png"
              />
              <hr />
              <TutorialBlock
                title="Erase"
                description="Erase with 4 finger tips straight!"
                image="demoErase.png"
              />
              <hr />
              <TutorialBlock
                title="Color Pick"
                description="Pick a color in the real world by doing an 'ok' sign"
                image="demoColorPick.png"
              />
              {/* <TutorialBlock
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
          /> */}
            </div>

            <div className={styles.floatingTutorial}>
              <Button
                name="Let's get creating"
                isPressed={false}
                onClick={updateShowTutorial}
              />
            </div>
          </div>
        </Tutorial>

        <Modal isVisible={showPublish} width={400} height={400}>
          <div className={styles.publishModal}>
            <h1 className={styles.tutTitle}>Publish Drawing?</h1>
            <p className={styles.tutSubtitle}>
              You're drawing looks great! Ready for the world to see it?
            </p>
            <div className={styles.bottomPublishButtons}>
              <Button
                name="No. Delete it."
                isPressed={false}
                onClick={resetDrawing}
              />
              <Button
                name="Publish"
                isPressed={false}
                onClick={updateShowPublish}
              />
            </div>
          </div>
        </Modal>

        <Modal isVisible={showCompetitionRule} width={400} height={300}>
          <div className={styles.competitionModal}>
            <h1 className={styles.tutTitle}>McHacks 10 Competition</h1>
            <p className={styles.tutSubtitle}>
              VizArt AI is having a competition for McHacks 10! We will showcase
              the best drawing of a face at 5PM ET on January 29! You only have
              60 seconds, but you have unlimited attempts. Get to creating and
              good luck!
            </p>
            <div className={styles.bottomButtonsComp}>
              <Button
                name="Let him cook 😤"
                isPressed={false}
                onClick={updateShowCompetition}
              />
            </div>
          </div>
        </Modal>
      </SizeCap>
    </div>
  );
}

//countdown
//action
