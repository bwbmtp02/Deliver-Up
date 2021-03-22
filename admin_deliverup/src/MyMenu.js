import React from "react";
import { Menu } from "react-admin";
import { withStyles } from "@material-ui/core/styles";
//import { indigo, pink, red, blue } from "@material-ui/core/colors";

const styles = {
  menu: {
    backgroundColor: "Indigo",
  },
};

const MyMenu = ({ classes, ...props }) => (
  <Menu className={classes.menu} {...props} />
);

export default withStyles(styles)(MyMenu);
