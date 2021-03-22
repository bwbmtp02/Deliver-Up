import { Avatar, Paper } from "@material-ui/core";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  NumberInput,
  NumberField,
  Filter,
  TextInput,
  SimpleForm,
  Create,
  Edit,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  Show,
  SimpleShowLayout,
  EditButton,
  DeleteButton,
  BooleanField,
  ArrayField,
} from "react-admin";

import { URL_MEDIA } from "../env";
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

const FullNameField = ({ record = {} }) => (
  <span>
    {record.firstName} {record.lastName}
  </span>
);
FullNameField.defaultProps = { label: "Name" };

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="lastName" alwaysOn />
  </Filter>
);

const EditTitle = ({ record }) => {
  return <span>Update {record ? `"${record.firstName}"` : ""}</span>;
};

const Picture = ({ record }) => (
  <Avatar src={`${URL_MEDIA}/picture/user/${record.profilPicture}`} />
);

const ShowViewPicture = ({ record }) => (
  <Avatar
    src={`${URL_MEDIA}/picture/user/${record.profilPicture}`}
    style={{
      display: "inline-flex",
      marginRight: "1rem",
      width: "15%",
      height: "5%",
    }}
  />
);

export const UserList = (props) => {
  // console.log(props.location);
  // const test = <TextField source="profilPicture" />;
  // console.log(test);
  return (
    <List {...props} filters={<UserFilter />}>
      <Datagrid rowClick="show">
        <Picture />
        <BooleanField source="isBanned" />
        <BooleanField source="deliverer" />
        {/* <TextField source="firstName" /> */}
        {/* <TextField source="lastName" /> */}
        <FullNameField source="lastName" />
        <TextField source="address.number" />
        <TextField source="address.street" />
        <TextField source="address.zipcode" />
        <TextField source="address.city" />
        <TextField source="phone" />
        <EmailField source="email" />
        <NumberField source="userPoint" />
        <NumberField source="like" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const UserShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props}>
    <SimpleShowLayout className={classes.main}>
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Full Name</h3>
      </Paper>
      <ShowViewPicture />
      <TextField source="firstName" className={classes.inlineBlock} />
      <TextField source="lastName" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Address</h3>
      </Paper>
      <TextField
        source="address.number"
        className={classes.numberAddress}
        label="Number"
      />
      <TextField
        source="address.street"
        className={classes.inlineBlock}
        label="Street"
      />
      <TextField
        source="address.zipcode"
        className={classes.numberAddress}
        label="Zipcode"
      />
      <TextField
        source="address.city"
        className={classes.inlineBlock}
        label="City"
      />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Contact Info</h3>
      </Paper>
      <TextField source="phone" className={classes.inlineBlock} />
      <EmailField source="email" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Client Status</h3>
      </Paper>
      <NumberField source="userPoint" className={classes.inlineBlock} />
      <NumberField source="like" className={classes.inlineBlock} />
      <BooleanField source="isBanned" className={classes.inlineBlock} />
      <BooleanField source="deliverer" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Client Delevery Info</h3>
      </Paper>
      <ArrayField source="deliveryHours">
        <Datagrid>
          <TextField source="start" className={classes.inlineBlock} />
          <TextField source="end" className={classes.inlineBlock} />
        </Datagrid>
      </ArrayField>
      <TextField
        source="deliveryArea.coordinates"
        label="Delivery Area Coordinates"
        className={classes.inlineBlock}
      />
    </SimpleShowLayout>
  </Show>
));

export const UserCreate = withStyles(styles)(({ classes, ...props }) => (
  <Create {...props}>
    <SimpleForm className={classes.main}>
      <BooleanInput source="isBanned" formClassName={classes.inlineBlock} />
      <BooleanInput
        source="deliverer"
        defaultValue
        formClassName={classes.inlineBlock}
      />
      <Spacer />
      <TextInput source="firstName" formClassName={classes.inlineBlock} />
      <TextInput source="lastName" formClassName={classes.inlineBlock} />
      <Spacer />
      <TextInput
        source="address.number"
        formClassName={classes.numberAddress}
      />
      <TextInput source="address.street" formClassName={classes.inlineBlock} />
      <TextInput
        source="address.zipcode"
        formClassName={classes.numberAddress}
      />
      <TextInput source="address.city" formClassName={classes.inlineBlock} />
      <Spacer />
      <TextInput source="phone" formClassName={classes.inlineBlock} />
      <TextInput
        source="email"
        type="email"
        formClassName={classes.inlineBlock}
      />
      {/* <TextInput type="password" source="password" resettable /> */}
      <NumberInput source="userPoint" />
      <ArrayInput source="deliveryHours">
        <SimpleFormIterator>
          <TextInput source="start" />
          <TextInput source="end" />
        </SimpleFormIterator>
      </ArrayInput>
      {/* <TextInput source="deliveryArea.coordinates" placeholder="" /> */}
    </SimpleForm>
  </Create>
));

export const UserEdit = withStyles(styles)(({ classes, ...props }) => (
  <Edit {...props} filters={<UserFilter />} title={<EditTitle />}>
    <SimpleForm className={classes.main}>
      <Paper className={classes.paperForm}>
        <h3>Full Name</h3>
      </Paper>
      <TextInput source="firstName" formClassName={classes.inlineBlock} />
      <TextInput source="lastName" formClassName={classes.inlineBlock} />

      <Paper className={classes.paperForm}>
        <h3>Address</h3>
      </Paper>
      <TextInput
        source="address.number"
        formClassName={classes.numberAddress}
      />
      <TextInput source="address.street" formClassName={classes.inlineBlock} />
      <TextInput
        source="address.zipcode"
        formClassName={classes.numberAddress}
      />
      <TextInput source="address.city" formClassName={classes.inlineBlock} />
      <Spacer />

      <Paper className={classes.paperForm}>
        <h3>Contact Info</h3>
      </Paper>
      <TextInput source="phone" formClassName={classes.inlineBlock} />
      <TextInput
        source="email"
        type="email"
        formClassName={classes.inlineBlock}
      />
      <Spacer />

      <Paper className={classes.paperForm}>
        <h3>Client Status</h3>
      </Paper>
      <BooleanInput source="isBanned" formClassName={classes.inlineBlock} />
      <BooleanInput
        source="deliverer"
        defaultValue
        formClassName={classes.inlineBlock}
      />
      <NumberInput source="userPoint" className={classes.inlineBlock} />
      <NumberInput source="like" className={classes.inlineBlock} />

      <Paper className={classes.paperForm}>
        <h3>Client Delevery Info</h3>
      </Paper>

      <ArrayInput source="deliveryHours">
        <SimpleFormIterator>
          <TextInput source="start" />
          <TextInput source="end" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="deliveryArea.coordinates" placeholder="" />
    </SimpleForm>
  </Edit>
));
