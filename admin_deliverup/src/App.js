import React from "react";
import { useState } from "react";

import "./App.css";
import { Admin, Resource } from "react-admin";
// import UserList from "./UserList";
import {
  MerchantList,
  MerchantEdit,
  MerchantCreate,
  MerchantShow,
} from "./adminView/Merchants";
import { UserList, UserEdit, UserCreate, UserShow } from "./adminView/Users";
import {
  OrderList,
  OrderEdit,
  // OrderCreate,
  OrderShow,
} from "./adminView/Orders";
import { MessageList, MessageShow } from "./adminView/Messages";
import {
  AdminList,
  AdminShow,
  AdminEdit,
  AdminCreate,
} from "./adminView/Admins";
import { GiftList, GiftShow, GiftEdit, GiftCreate } from "./adminView/Gifts";
import myDataProvider from "./myDataProvider";
import { fetchJson as httpClient } from "./httpClient";
import authProvider from "./authProvider";
import Login from "./adminView/Login";
import { createMuiTheme } from "@material-ui/core/styles";
import Dashboard from "./adminView/Dashboard";
import IconMerchant from "@material-ui/icons/Store";
import IconAdmin from "@material-ui/icons/Build";
import IconUser from "@material-ui/icons/Person";
import IconOrder from "@material-ui/icons/ShoppingCart";
import IconMessage from "@material-ui/icons/Textsms";
import RedeemIcon from "@material-ui/icons/Redeem";
import NotFound from "./adminView/NotFound";
import MyLayout from "./MyLayout";
import ThemeContext from "./ThemeContext";

const dataProvider = myDataProvider(
  "http://51.83.69.138:5000/api/admin",
  //"http://localhost:5000/api/admin",
  httpClient
);
const App = () => {
  // initialize default theme color to Dark
  const [theme, setTheme] = useState("light");

  // Create a Context
  const contextValue = {
    theme: theme,
    updateTheme: setTheme,
  };

  // Create a Theme color  Dark or Light
  const myTheme = createMuiTheme({
    palette: {
      type: theme, // Switching the (dark || light) mode on is a single property value change.
      secondary: {
        main: "#c490d1",
      },
    },

    shadows: [
      "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
    ],
  });

  return (
    <ThemeContext.Provider value={contextValue}>
      <Admin
        theme={myTheme}
        catchAll={NotFound}
        title="My custom admin"
        loginPage={Login}
        dataProvider={dataProvider}
        authProvider={authProvider}
        dashboard={Dashboard}
        appLayout={MyLayout}
      >
        <Resource
          name="merchants"
          list={MerchantList}
          create={MerchantCreate}
          edit={MerchantEdit}
          show={MerchantShow}
          icon={IconMerchant}
        />
        <Resource
          name="users"
          list={UserList}
          create={UserCreate}
          edit={UserEdit}
          show={UserShow}
          icon={IconUser}
        />
        <Resource
          name="orders"
          list={OrderList}
          // create={OrderCreate}
          edit={OrderEdit}
          show={OrderShow}
          icon={IconOrder}
        />
        <Resource
          name="messages"
          list={MessageList}
          show={MessageShow}
          icon={IconMessage}
        />
        <Resource
          name="gifts"
          list={GiftList}
          create={GiftCreate}
          show={GiftShow}
          edit={GiftEdit}
          icon={RedeemIcon}
        />
        <Resource
          name="admins"
          list={AdminList}
          show={AdminShow}
          edit={AdminEdit}
          create={AdminCreate}
          icon={IconAdmin}
        />
      </Admin>
    </ThemeContext.Provider>
  );
};
export default App;
