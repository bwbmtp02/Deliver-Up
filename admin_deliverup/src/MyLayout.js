import { Layout } from "react-admin";
import MyAppBar from "./MyAppBar";
import React from "react";
//import MyMenu from "./MyMenu";
const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
export default MyLayout;
