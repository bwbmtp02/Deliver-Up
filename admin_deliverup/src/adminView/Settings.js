import * as React from "react";
import Card from "@material-ui/core/Card";
import { CardContent, CardHeader, Button } from "@material-ui/core";
import { Title, Admin } from "react-admin";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
const name = localStorage.getItem("username");
const theme = createMuiTheme({ palette: { type: "dark" } });
export default () => (
  <Card>
    <Title title={"Setting to " + `${name}`} />
    <CardHeader
      title={"Welcome " + `${name}` + " to Deliver'Up Administration Page"}
    />
    <ThemeProvider theme={theme}>
      <Button variant="contained" color="primary">
        Change Theme
      </Button>
    </ThemeProvider>
    <CardContent> Access Page Only for Team API + ADMIN 🚀 ...</CardContent>
  </Card>
);
