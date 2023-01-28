import { useState } from "react";
import styles from "./style.module.scss";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import Tool from "../../components/Tool/Tool";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";

export default function Create() {
  // const [value, setValue] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const updateIsVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <Button name="Create" isPressed={false} onClick={updateIsVisible} />
      Create
      {/* <Tool name="pen" icon={faEnvelope} isActive={false} />
      <Button name="Create" isPressed={true} />
      <Input
        value={value}
        setValue={setValue}
        placeholder="Search anything..."
      /> */}
      <Modal isVisible={isVisible} width={300} height={400}>
        <>
          <h1>This is a test</h1>
          <p>Put all the content you want in here</p>
          <Button name="Close" isPressed={false} onClick={updateIsVisible} />
        </>
      </Modal>
    </div>
  );
}
