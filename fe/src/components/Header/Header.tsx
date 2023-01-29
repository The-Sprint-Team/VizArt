import styles from "./style.module.scss";
import Button from "../Button/Button";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import logo from "../../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (link: string) => {
    navigate(link);
  };

  const isPressed = (link: string) => {
    return location.pathname === link;
  };

  useEffect(() => {}, [location]);

  return (
    <div className={styles.header}>
      <img src={logo} alt="Logo" className={styles.logo} />

      <div>
        <Button
          name="Create"
          onClick={() => onClick("/create")}
          isPressed={isPressed("/create")}
        />
        <Button
          name="Compete"
          onClick={() => onClick("/compete")}
          isPressed={isPressed("/compete")}
        />
        <Button
          name="Explore"
          onClick={() => onClick("/explore")}
          isPressed={isPressed("/explore")}
        />
      </div>
    </div>
  );
}
