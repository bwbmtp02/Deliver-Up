import React from "react";
import { AppBar } from "react-admin";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Toggle from "./Toggle";

const styles = {
  title: {
    flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  spacer: {
    flex: 1,
  },
};

const MyAppBar = withStyles(styles)(({ classes, ...props }) => (
  <AppBar {...props}>
    <Typography
      variant="title"
      color="inherit"
      className={classes.title}
      id="react-admin-title"
    />
    <Toolbar>
      <h1
        style={{
          color: "white",
          textShadow: "black 0.1em 0.1em 0.2em",
        }}
      >
        Deliver' <span style={{ color: "orange" }}> Up</span>{" "}
      </h1>
    </Toolbar>
    <span className={classes.spacer} />
    {/* <MyUserMenu /> */}
    <Toggle />
  </AppBar>
));
export default MyAppBar;
