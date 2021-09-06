import React from "react";
// Components
import Chart from "react-apexcharts";
// Styles
import { Wrapper } from "./donutChart.style";
// Colors
import { colors } from "../../helpers/colors";

const DonutChart = ({ balanceData }) => {
  let balanceSeries = [];
  let labels = [];
  let totalBalance = 0.0;
  for (let i = 0; i < balanceData.length; i++) {
    let value = (
      (parseFloat(balanceData[i]["balance"]) /
        Math.pow(10, parseFloat(balanceData[i]["decimals"]))) *
      balanceData[i]["usdPrice"]
    ).toFixed(2);
    labels.push(balanceData[i]["name"]);
    balanceSeries.push(parseFloat(value));
    totalBalance += parseFloat(value);
  }

  const options = {
    labels: labels,
    stroke: {
      width: 0,
    },
    chart: {
      type: "donut",
    },
    colors: colors,
    fill: {
      type: "gradient",
    },
    legend: {
      position: "bottom",
      labels: { colors: "#FFFFFF" },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: 500,
          },
        },
      },
    ],
  };

  if (balanceData.length === 0) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
        <h2>{`Total ${totalBalance.toFixed(2)} USD`}</h2>
        <div>
          <Chart
            id="balance-chart"
            options={options}
            series={balanceSeries}
            type="donut"
          />
        </div>
      </Wrapper>
    );
  }
};

export default DonutChart;
