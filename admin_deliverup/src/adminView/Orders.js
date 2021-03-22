import React from "react";
import { Paper } from "@material-ui/core";

import {
  List,
  Datagrid,
  TextField,
  DateField,
  ArrayField,
  EditButton,
  DeleteButton,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  SelectInput,
  TextInput,
  Filter,
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

const OrderFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="lastName" alwaysOn />
  </Filter>
);

export const OrderList = (props) => (
  <List {...props} filters={<OrderFilter />}>
    <Datagrid rowClick="show">
      <DateField source="date" />
      <TextField source="state" />
      <TextField source="user.firstName" label="Client FirstName" />
      <TextField source="user.lastName" label="Client LastName" />
      <TextField source="merchant.enterprise" label="Shop" />
      <TextField source="id" label="Order Number" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const OrderShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props}>
    <SimpleShowLayout className={classes.main}>
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Order Infos</h3>
      </Paper>
      <DateField source="date" className={classes.inlineBlock} />
      <TextField source="state" className={classes.inlineBlock} />
      <TextField source="id" label="Id Order" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Client Infos</h3>
      </Paper>
      <TextField
        source="user.idUser"
        label="Id User"
        className={classes.inlineBlock}
      />
      <Spacer />
      <TextField
        source="user.firstName"
        label="FirstName"
        className={classes.inlineBlock}
      />
      <TextField
        source="user.lastName"
        label="LastName"
        className={classes.inlineBlock}
      />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Merchant Infos</h3>
      </Paper>
      <TextField
        source="merchant.idMerchant"
        label="Id Merchant"
        className={classes.inlineBlock}
      />
      <TextField
        source="merchant.enterprise"
        label="Shop"
        className={classes.inlineBlock}
      />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Deliverer Infos</h3>
      </Paper>
      <TextField
        source="deliverer.idDeliverer"
        label="Id Deliverer"
        className={classes.inlineBlock}
      />
      <Spacer />
      <TextField
        source="deliverer.firstName"
        label="FirstName"
        className={classes.inlineBlock}
      />
      <TextField
        source="deliverer.lastName"
        label="LastName"
        className={classes.inlineBlock}
      />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Products</h3>
      </Paper>
      <ArrayField source="products" label=" ">
        <Datagrid>
          <TextField source="idProduct" className={classes.inlineBlock} />
          <TextField source="name" className={classes.inlineBlock} />
          <TextField source="quantity" className={classes.inlineBlock} />
          <TextField source="price" className={classes.inlineBlock} />
        </Datagrid>
      </ArrayField>
      <EditButton />
    </SimpleShowLayout>
  </Show>
));

export const OrderEdit = withStyles(styles)(({ classes, ...props }) => (
  <Edit {...props}>
    <SimpleForm className={classes.main}>
      <SelectInput
        source="state"
        choices={[
          { id: "done", name: "done" },
          { id: "cancel", name: "cancel" },
          { id: "inProgress", name: "inProgress" },
          { id: "awaitingDelivery", name: "awaitingDelivery" },
          { id: "pendingDeliverer", name: "pendingDeliverer" },
          { id: "pendingMerchant", name: "pendingMerchant" },
        ]}
      />
    </SimpleForm>
  </Edit>
));
