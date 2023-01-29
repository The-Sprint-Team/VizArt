import styles from "./style.module.scss";
import Button from "../Button/Button";
import SizeCap from "../SizeCap/SizeCap";

import { useNavigate, useLocation, Link } from "react-router-dom";
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

  const alternate = (
    <div>
      <Button
        name="Explore"
        onClick={() => onClick("/explore")}
        isPressed={isPressed("/explore")}
        fontSize={20}
      />
    </div>
  );

  return (
    <div className={styles.header}>
      <Link to="/explore">
        <img src={logo} alt="Logo" className={styles.logo} />
      </Link>
      <SizeCap width={600} alternate={alternate}>
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
      </SizeCap>
    </div>
  );
}
