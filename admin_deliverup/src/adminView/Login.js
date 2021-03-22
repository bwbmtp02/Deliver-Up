import React from "react";
import { Login } from "react-admin";
import { withStyles } from "@material-ui/core/styles";
const styles = {
  icon: { display: "none" },
};
const CustomLoginPage = (props) => (
  <Login
    // backgroundImage={image}
    backgroundImage="https://source.unsplash.com/random/1600x900/?nature"
    {...props}
  />
);
export default withStyles(styles)(CustomLoginPage);
