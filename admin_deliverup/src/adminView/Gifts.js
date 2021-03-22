import { Avatar } from "@material-ui/core";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  TextInput,
  SimpleForm,
  Create,
  Edit,
  Show,
  SimpleShowLayout,
  EditButton,
  DeleteButton,
} from "react-admin";

import { withStyles } from "@material-ui/core/styles";

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

// const FullNameField = ({ record = {} }) => (
//     <span>
//         {record.firstName} {record.lastName}
//     </span>
// );
// FullNameField.defaultProps = { label: "Name" };

// const UserFilter = (props) => (
//     <Filter {...props}>
//         <TextInput label="Search by name" source="name" alwaysOn />
//     </Filter>
// );

const EditTitle = ({ record }) => {
  return <span>Update {record ? `"${record.name}"` : ""}</span>;
};

const Picture = ({ record }) => <Avatar src={`${record.gifts[0].picture}`} />;

const ShowViewPicture = ({ record }) => (
  <Avatar
    src={`${record.gifts[0].picture}`}
    style={{
      display: "inline-flex",
      marginRight: "1rem",
      width: "15%",
      height: "5%",
    }}
  />
);

export const GiftList = (props) => {
  // console.log(props.location);
  // const test = <TextField source="profilPicture" />;
  // console.log(test);
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <Picture />
        <TextField source="gifts[0].name" label="Name" />
        <TextField source="gifts[0].quantity" label="Quantity" />
        <TextField source="gifts[0].description" label="Description" />
        <TextField source="gifts[0].pointNeeded" label="Point Needed" />
        <TextField source="idMerchant" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const GiftShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props}>
    <SimpleShowLayout className={classes.main}>
      <ShowViewPicture />
      <TextField source="gifts[0].name" className={classes.inlineBlock} />

      <TextField
        source="gifts[0].quantity"
        className={classes.inlineBlock}
        label="Quantiy"
      />
      <TextField
        source="gifts[0].description"
        className={classes.inlineBlock}
        label="Description"
      />
      <TextField
        source="gifts[0].pointNeeded"
        className={classes.inlineBlock}
        label="Point Needed"
      />
      <TextField source="idMerchant" className={classes.inlineBlock} />
    </SimpleShowLayout>
  </Show>
));

export const GiftCreate = withStyles(styles)(({ classes, ...props }) => (
  <Create {...props}>
    <SimpleForm className={classes.main}>
      <TextInput source="idMerchant" formClassName={classes.inlineBlock} />
      <TextInput source="gifts[0].name" formClassName={classes.inlineBlock} />
      <TextInput
        source="gifts[0].quantity"
        formClassName={classes.numberAddress}
      />
      <TextInput
        source="gifts[0].picture"
        formClassName={classes.inlineBlock}
      />
      <TextInput
        source="gifts[0].description"
        formClassName={classes.numberAddress}
      />
      <TextInput
        source="gifts[0].pointNeeded"
        formClassName={classes.inlineBlock}
      />
    </SimpleForm>
  </Create>
));

export const GiftEdit = withStyles(styles)(({ classes, ...props }) => (
  <Edit {...props} title={<EditTitle />}>
    <SimpleForm className={classes.main}>
      <TextInput source="idMerchant" formClassName={classes.inlineBlock} />
      <TextInput source="gifts[0].name" formClassName={classes.inlineBlock} />
      <TextInput
        source="gifts[0].quantity"
        formClassName={classes.numberAddress}
      />
      <TextInput
        source="gifts[0].picture"
        formClassName={classes.inlineBlock}
      />
      <TextInput
        source="gifts[0].description"
        formClassName={classes.numberAddress}
      />
      <TextInput
        source="gifts[0].pointNeeded"
        formClassName={classes.inlineBlock}
      />
    </SimpleForm>
  </Edit>
));
