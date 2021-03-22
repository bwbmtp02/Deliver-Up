import React, { Component } from "react";
import { CardContent, CardHeader } from "@material-ui/core";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
const URL_API_DATA = "";

export default class CheeseChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPie: [],
      COLORS: ["#0353a4", "#00A8E8"],
    };
  }

  componentDidMount = () => {
    this.dataChart();
  };

  dataChart = async () => {
    let nonFood = 0;
    let alimentary = 0;
    const dataPie = [{ name: "Non-Food" }, { name: "Alimentary" }];

    await axios.get(`${URL_API_DATA}/allShop`).then((res) => {
      res.data.map((ele) => {
        if (ele.foodShop === true) {
          return alimentary++;
        } else {
          return nonFood++;
        }
      });
    });
    dataPie[0]["value"] = nonFood;
    dataPie[1]["value"] = alimentary;

    this.setState({ dataPie: dataPie });
  };

  render() {
    return (
      <CardContent
        style={{
          // float: "right",
          width: "50%",
          alignSelf: "center",
          backgroundColor: "#424242",
          color: "#00f4e0",
        }}
      >
        <CardHeader title={`Non-Food / Alimentary Ratio`} />
        <ResponsiveContainer width="100%" height={250}>
          <PieChart height={250}>
            <Pie
              data={this.state.dataPie}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="orange"
              dataKey="value"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                const RADIAN = Math.PI / 180;
                // eslint-disable-next-line
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                // eslint-disable-next-line
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                // eslint-disable-next-line
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {this.state.dataPie[index].name} ({value})
                  </text>
                );
              }}
            >
              {this.state.dataPie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={this.state.COLORS[index % this.state.COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    );
  }
}
