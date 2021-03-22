import React, { Component } from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { PieChart, Pie, Label, ResponsiveContainer } from "recharts";
import axios from "axios";
import moment from "moment";
const URL_API_DATA = "";

export default class CercleChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: "Non-Verify Merchant" },
        { name: "All Users" },
        { name: "Today Orders" },
      ],
      cercle: [{ value: 1 }],
    };
  }
  componentDidMount = () => {
    this.dataChartNonVerifyMerchant();
    this.dataChartAllUsers();
    this.dataChartTodayOrdersInProgress();
  };
  dataChartNonVerifyMerchant = async () => {
    const data = [...this.state.data];
    let isNotVerify = 0;
    await axios.get(`${URL_API_DATA}/allShop`).then((res) => {
      res.data.map((ele) => {
        if (ele.isVerify === false) {
          return isNotVerify++;
        } else {
          return isNotVerify;
        }
      });
    });
    data[0]["value"] = isNotVerify;
    this.setState({ data: data });
  };
  dataChartAllUsers = async () => {
    const data = [...this.state.data];
    let allUsers = 0;
    await axios.get(`${URL_API_DATA}/allUsers`).then((res) => {
      allUsers = res.data;
    });
    data[1]["value"] = allUsers;
    this.setState({ data: data });
  };
  dataChartTodayOrdersInProgress = async () => {
    const data = [...this.state.data];
    let allOrders = 0;
    let day = moment().format("YYYY-MM-DD");
    await axios
      .get(`${URL_API_DATA}/todayOrdersinProgress/${day}`)
      .then((res) => {
        allOrders = res.data;
      });
    data[2]["value"] = allOrders;
    this.setState({ data: data });
  };
  render() {
    return (
      <Card
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor: "#424242",
          color: "#b5838d",
          borderWidth: 2,
          borderColer: "#f50057",
        }}
      >
        <CardContent
          style={{
            width: "30%",
            alignSelf: "center",
          }}
        >
          <CardHeader title={`Non-Verify Merchant`} />
          <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
              <Pie
                data={this.state.cercle}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#79addc"
                //onMouseOver={this.onPieEnter}
              >
                <Label
                  value={this.state.data[0].value}
                  position="center"
                  fill="#F49405"
                  style={{
                    fontSize: "50",
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardContent
          style={{
            width: "30%",
            alignSelf: "center",
          }}
        >
          <CardHeader title={`Number of all users`} />
          <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
              <Pie
                activeIndex={this.state.activeIndex}
                data={this.state.cercle}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#ffc09f"
                //onMouseOver={this.onPieEnter}
              >
                <Label
                  value={this.state.data[1].value}
                  position="center"
                  fill="#F49405"
                  style={{ fontSize: "50" }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardContent
          style={{
            width: "30%",
            alignSelf: "center",
          }}
        >
          <CardHeader title={`Today Orders in Progress`} />
          <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
              <Pie
                activeIndex={this.state.activeIndex}
                data={this.state.cercle}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#adf7b6"
                //onMouseOver={this.onPieEnter}
              >
                <Label
                  value={this.state.data[2].value}
                  position="center"
                  fill="#F49405"
                  style={{ fontSize: "50" }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}
