import { Paper } from "@material-ui/core";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  TextInput,
  EditButton,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
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
    backgroundColor: "#303030",
  },
  paper: {
    color: "#598BFF",
    textAlign: "center",
    backgroundColor: "#424242",
  },
  paperForm: {
    color: "#598BFF",
    backgroundColor: "#424242",
    textAlign: "center",
    width: "100%",
  },
};

const ListTitle = ({ record }) => {
  return <span>Show {record ? `"${record.username}"` : ""}</span>;
};

export const AdminList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="username" />
      <TextField source="phone" />
      <EmailField source="email" type="email" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AdminShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props} title={<ListTitle />}>
    <SimpleShowLayout className={classes.main}>
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Full Name</h3>
      </Paper>
      <TextField source="firstName" className={classes.inlineBlock} />
      <TextField source="lastName" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Contact Infos</h3>
      </Paper>
      <TextField source="username" className={classes.inlineBlock} />
      <TextField source="phone" className={classes.inlineBlock} />
      <EmailField source="email" type="email" className={classes.inlineBlock} />
      {/* <TextField source="password" type="password" /> */}
      <EditButton />
      {/* <DeleteButton /> */}
    </SimpleShowLayout>
  </Show>
));

export const AdminCreate = withStyles(styles)(({ classes, ...props }) => (
  <Create {...props}>
    <SimpleForm className={classes.main}>
      <Spacer />
      <TextInput source="firstName" formClassName={classes.inlineBlock} />
      <TextInput source="lastName" formClassName={classes.inlineBlock} />
      <Spacer />
      <TextInput source="username" formClassName={classes.inlineBlock} />
      <TextInput source="phone" formClassName={classes.inlineBlock} />
      <TextInput
        source="email"
        type="email"
        formClassName={classes.inlineBlock}
      />
    </SimpleForm>
  </Create>
));

export const AdminEdit = withStyles(styles)(({ classes, ...props }) => (
  <Edit {...props}>
    <SimpleForm className={classes.main}>
      <Spacer />
      <TextInput source="firstName" formClassName={classes.inlineBlock} />
      <TextInput source="lastName" formClassName={classes.inlineBlock} />
      <Spacer />
      <TextInput source="username" formClassName={classes.inlineBlock} />
      <TextInput source="phone" formClassName={classes.inlineBlock} />
      <TextInput
        source="email"
        type="email"
        formClassName={classes.inlineBlock}
      />
    </SimpleForm>
  </Edit>
));
