import React from "react";
import { Paper } from "@material-ui/core";

import {
  List,
  Datagrid,
  TextField,
  DateField,
  ArrayField,
  Show,
  SimpleShowLayout,
} from "react-admin";

import { withStyles } from "@material-ui/core/styles";

const Spacer = () => <span style={{ width: "1em" }} />;

const styles = {
  inlineBlock: {
    display: "inline-flex",
    marginRight: "1rem",
  },
  numberAddress: {
    display: "inline-flex",
    marginRight: "1rem",
    // width: "2rem",
  },
  main: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    width: "70%",
    backgroundColor: "inherit",
  },
  paper: {
    color: "#598BFF",
    textAlign: "center",
    backgroundColor: "inherit",
  },
  paperForm: {
    color: "#598BFF",
    backgroundColor: "inherit",
    textAlign: "center",
    width: "100%",
  },
};

export const MessageList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="idOrder" />
      <DateField source="createdAt" />
      <ArrayField source="messageDeliverer">
        <Datagrid>
          <TextField source="state" />
          {/* <TextField source="_id" /> */}
          <TextField source="text" />
          <DateField source="date" showTime />
        </Datagrid>
      </ArrayField>
      <ArrayField source="messageCustomer">
        <Datagrid>
          <TextField source="state" />
          {/* <TextField source="_id" /> */}
          <TextField source="text" />
          <DateField source="date" showTime />
        </Datagrid>
      </ArrayField>
      {/* <EditButton />
      <DeleteButton /> */}
    </Datagrid>
  </List>
);

export const MessageShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props}>
    <SimpleShowLayout className={classes.main}>
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Order Infos</h3>
      </Paper>
      <TextField source="idOrder" className={classes.inlineBlock} />
      <DateField source="createdAt" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Deliverer Messages</h3>
      </Paper>
      <ArrayField source="messageDeliverer" label=" ">
        <Datagrid>
          <TextField source="state" className={classes.inlineBlock} />
          <TextField source="_id" className={classes.inlineBlock} />
          <TextField source="text" className={classes.inlineBlock} />
          <DateField source="date" showTime className={classes.inlineBlock} />
        </Datagrid>
      </ArrayField>
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Client Messages</h3>
      </Paper>
      <ArrayField source="messageCustomer" label=" ">
        <Datagrid>
          <TextField source="state" className={classes.inlineBlock} />
          <TextField source="_id" className={classes.inlineBlock} />
          <TextField source="text" className={classes.inlineBlock} />
          <DateField source="date" showTime className={classes.inlineBlock} />
        </Datagrid>
      </ArrayField>
      {/* <EditButton />
      <DeleteButton /> */}
    </SimpleShowLayout>
  </Show>
));
