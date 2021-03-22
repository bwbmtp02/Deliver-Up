import * as React from "react";
import Card from "@material-ui/core/Card";

import { Title } from "react-admin";
import Chart from "./Charts/Chart";
import CheeseChart from "./Charts/PieChart";
import CercleChart from "./Charts/CercleChart";

const name = localStorage.getItem("username");

export default () => (
  <div style={{ textAlign: "center", width: "94%" }}>
    <Card style={{ backgroundColor: "#7D8CC4" }}>
      <Title title={`Welcome home ${name}`} />
    </Card>
    <Card>
      <CercleChart />
      <Card
        style={{
          display: "flex",
          backgroundColor: "#424242",
        }}
      >
        <Chart />
        <CheeseChart />
      </Card>
    </Card>
  </div>
);
