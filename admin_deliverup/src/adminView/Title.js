import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { Title } from "react-admin";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
}));

export default function CenteredTextAppBar() {
  const classes = useStyles();

  return (
    <div>
      <Title className={classes.title} title="Deliver'Up" />
    </div>
  );
}
