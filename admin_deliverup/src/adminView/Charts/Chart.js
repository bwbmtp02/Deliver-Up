import React, { Component } from "react";
import { CardContent, CardHeader } from "@material-ui/core";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import moment from "moment";
import axios from "axios";
const URL_API_DATA = "";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const nbrPasseDay = moment().format("DD");
    this.state = {
      date: nbrPasseDay - 1,
      data: [],
    };
  }
  componentDidMount = () => {
    this.dataChart();
  };
  dataChart = async () => {
    const data = [];
    for (let i = this.state.date; i >= 0; i--) {
      let currentDay = moment().subtract(i, "days").format("YYYY-MM-DD");
      data.push({ day: currentDay });
    }
    for (let j = 0; j <= this.state.date; j++) {
      data[j]["x"] = j + 1;
      await axios
        .get(`${URL_API_DATA}/ordersChart/${data[j].day}`)
        .then((res) => {
          data[j]["orders"] = res.data;
        });
    }
    this.setState({ data: data });
  };
  render() {
    return (
      <CardContent
        style={{
          // float: "left",
          width: "50%",
          height: "50%",
          // alignSelf: "center",
          backgroundColor: "#424242",
          color: "#00f4e0",
        }}
      >
        <CardHeader title={`Number Of ${moment().format("MMMM")} Sales`} />
        <BarChart
          width={550}
          height={200}
          data={this.state.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={"x"} />
          <YAxis />
          <Tooltip />
          <Bar
            type="monotone"
            dataKey="orders"
            // stroke="#1A936F"
            fill="#1A936F"
          />
        </BarChart>
      </CardContent>
    );
  }
}
