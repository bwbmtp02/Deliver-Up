import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "./ThemeContext";

export default function Toggle() {
  const { theme, updateTheme } = useContext(ThemeContext);
  const handleClick = (e) => {
    if (theme === "light") {
      updateTheme("dark");
    } else updateTheme("light");
    console.log(theme);
  };

  return (
    <div>
      <Button onClick={handleClick}>
        {theme !== "dark" ? (
          <FontAwesomeIcon icon={faSun} color="#ffff3f" size={"2x"} />
        ) : (
          <FontAwesomeIcon icon={faMoon} color="#03045e" size={"2x"} />
        )}
      </Button>
    </div>
  );
}
