import { Avatar, Paper } from "@material-ui/core";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  EditButton,
  DeleteButton,
  ArrayField,
  ArrayInput,
  BooleanField,
  SimpleShowLayout,
  Show,
} from "react-admin";
import {
  Create,
  Edit,
  SimpleForm,
  SimpleFormIterator,
  BooleanInput,
} from "react-admin";

import { URL_MEDIA } from "../env";
import { withStyles } from "@material-ui/core/styles";

const Spacer = () => <span style={{ width: "1em" }} />;
const VerticalSpacer = () => <span style={{ height: "1em " }} />;
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

const EditTitle = ({ record }) => {
  return <span>Update {record ? `"${record.name}"` : ""}</span>;
};
const CreateTitle = ({ record }) => {
  return <span>Create {record ? `"${record.name}"` : ""}</span>;
};
const MerchantFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search by Enterprise" source="enterprise" alwaysOn />
  </Filter>
);

const Picture = ({ record }) => (
  <Avatar src={`${URL_MEDIA}/picture/merchant/${record.pictures}`} />
);

const ShowViewPicture = ({ record }) => (
  <Avatar
    src={`${URL_MEDIA}/picture/merchant/${record.pictures}`}
    style={{
      display: "inline-flex",
      marginRight: "1rem",
      width: "15%",
      height: "5%",
    }}
  />
);

export const MerchantList = (props) => (
  <List {...props} filters={<MerchantFilter />}>
    <Datagrid rowClick="show">
      <Picture />
      <BooleanField source="isVerify" />
      <BooleanField source="foodShop" />
      <TextField source="category" />
      <TextField source="enterprise" />
      <TextField source="name" />
      <TextField source="phone" />
      <TextField source="email" />
      <TextField source="address.number" />
      <TextField source="address.street" />
      <TextField source="address.zipcode" />
      <TextField source="address.city" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const MerchantShow = withStyles(styles)(({ classes, ...props }) => (
  <Show {...props} filters={<MerchantFilter />}>
    <SimpleShowLayout className={classes.main}>
      <VerticalSpacer />
      <Paper className={classes.paper}>
        <h3>Enterprise</h3>
      </Paper>
      <ShowViewPicture />
      <TextField source="category" className={classes.inlineBlock} />
      <TextField source="enterprise" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Merchant Status</h3>
      </Paper>
      <BooleanField source="isVerify" className={classes.inlineBlock} />
      <BooleanField source="foodShop" className={classes.inlineBlock} />
      <BooleanField source="isOpen" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Merchant Infos</h3>
      </Paper>
      <TextField source="name" className={classes.inlineBlock} />
      <TextField source="phone" className={classes.inlineBlock} />
      <TextField source="email" className={classes.inlineBlock} />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Address</h3>
      </Paper>
      <TextField
        source="address.number"
        label="Number"
        className={classes.numberAddress}
      />
      <TextField
        source="address.street"
        label="Street"
        className={classes.inlineBlock}
      />
      <TextField
        source="address.zipcode"
        label="Zipcode"
        className={classes.numberAddress}
      />
      <TextField
        source="address.city"
        label="City"
        className={classes.inlineBlock}
      />
      <Spacer />
      <Paper className={classes.paper}>
        <h3>Products</h3>
      </Paper>
      <ArrayField source="products" label=" ">
        <Datagrid>
          <TextField source="name" className={classes.inlineBlock} />
          <TextField source="price" className={classes.inlineBlock} />
          <TextField source="picture" className={classes.inlineBlock} />
          <BooleanField source="available" className={classes.inlineBlock} />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
));

export const MerchantEdit = withStyles(styles)(({ classes, ...props }) => (
  <Edit {...props} title={<EditTitle />}>
    <SimpleForm className={classes.main}>
      <Spacer />
      <Paper className={classes.paperForm}>
        <h3>Enterprise Info</h3>
      </Paper>
      <TextInput
        source="enterprise"
        resettable
        formClassName={classes.inlineBlock}
      />

      <TextInput source="name" resettable formClassName={classes.inlineBlock} />
      <Spacer />
      <BooleanInput
        source="foodShop"
        valueLabelTrue="Alimentary"
        valueLabelFalse="Non-alimentary"
        formClassName={classes.inlineBlock}
      />

      <TextInput
        source="category"
        resettable
        formClassName={classes.inlineBlock}
      />
      <Spacer />
      <TextInput source="IBAN" formClassName={classes.inlineBlock} resettable />
      <TextInput
        source="siretNumber"
        formClassName={classes.inlineBlock}
        resettable
      />
      <Spacer />
      <Paper className={classes.paperForm}>
        <h3>Enterprise Address</h3>
      </Paper>
      <TextInput
        source="address.number"
        label="address Number"
        formClassName={classes.numberAddress}
        resettable
      />
      <TextInput
        source="address.street"
        label="address Street"
        formClassName={classes.inlineBlock}
        resettable
      />
      <TextInput
        source="address.zipcode"
        formClassName={classes.numberAddress}
        label="address Zipcode"
        resettable
      />
      <TextInput
        source="address.city"
        formClassName={classes.inlineBlock}
        label="address City"
        resettable
      />
      <Spacer />

      <Spacer />
      <Paper className={classes.paperForm}>
        <h3>Enterprise Status</h3>
      </Paper>
      <BooleanInput
        source="isVerify"
        valueLabelTrue="Checked"
        valueLabelFalse="Unchecked"
        formClassName={classes.inlineBlock}
      />
      <BooleanInput
        source="isOpen"
        valueLabelTrue="Open"
        valueLabelFalse="Close"
        formClassName={classes.inlineBlock}
      />
      <Paper className={classes.paperForm}>
        <h3>Enterprise Contact</h3>
      </Paper>
      <TextInput
        source="phone"
        resettable
        formClassName={classes.inlineBlock}
      />
      <TextInput
        type="email"
        source="email"
        placeholder="example@gmail.it"
        formClassName={classes.inlineBlock}
        resettable
      />

      <Paper className={classes.paperForm}>
        <h3>Enterprise Products</h3>
      </Paper>
      <ArrayInput source="products">
        <SimpleFormIterator>
          <TextInput source="name" resettable />
          <TextInput source="price" resettable />
          <TextInput source="picture" resettable />
          <BooleanInput source="available" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
));

export const MerchantCreate = withStyles(styles)(({ classes, ...props }) => (
  <Create {...props} component="div" title={<CreateTitle />}>
    <SimpleForm className={classes.main}>
      <Spacer />
      <BooleanInput
        source="isVerify"
        valueLabelTrue="Checked"
        valueLabelFalse="Unchecked"
        formClassName={classes.inlineBlock}
      />
      <BooleanInput
        source="foodShop"
        valueLabelTrue="Alimentary"
        valueLabelFalse="Non-alimentary"
        formClassName={classes.inlineBlock}
      />
      <BooleanInput
        source="isOpen"
        valueLabelTrue="Open"
        valueLabelFalse="Close"
        formClassName={classes.inlineBlock}
      />
      <Spacer />
      <TextInput
        source="category"
        resettable
        formClassName={classes.inlineBlock}
      />
      <TextInput
        source="enterprise"
        resettable
        formClassName={classes.inlineBlock}
      />
      <Spacer />
      <TextInput source="name" resettable formClassName={classes.inlineBlock} />
      <TextInput
        source="phone"
        resettable
        formClassName={classes.inlineBlock}
      />
      <TextInput
        type="email"
        source="email"
        placeholder="example@gmail.it"
        formClassName={classes.inlineBlock}
        resettable
      />
      <Spacer />
      {/* <TextInput type="password" source="password" resettable /> */}
      <TextInput
        source="address.number"
        label="address Number"
        formClassName={classes.numberAddress}
        resettable
      />
      <TextInput
        source="address.street"
        label="address Street"
        formClassName={classes.inlineBlock}
        resettable
      />
      <TextInput
        source="address.zipcode"
        formClassName={classes.numberAddress}
        label="address Zipcode"
        resettable
      />
      <TextInput
        source="address.city"
        formClassName={classes.inlineBlock}
        label="address City"
        resettable
      />
      <Spacer />
      <TextInput source="IBAN" formClassName={classes.inlineBlock} resettable />
      <TextInput
        source="siretNumber"
        formClassName={classes.inlineBlock}
        resettable
      />
      <Spacer />
      <ArrayInput source="products">
        <SimpleFormIterator>
          <TextInput source="name" resettable />
          <TextInput source="price" resettable />
          <TextInput source="picture" resettable />
          <BooleanInput source="available" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
));
