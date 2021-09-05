import React from "react";
// Components
import Chart from "react-apexcharts";
// Styles
import { Wrapper } from "./donutChart.style";

const DonutChart = ({ balanceData }) => {
  let balanceSeries = [];
  let labels = [];
  let totalBalance;
  for (let i = 0; i < balanceData.length; i++) {
    let value = ((parseFloat(balanceData[i]["balance"]) / Math.pow(10, parseFloat(balanceData[i]["decimals"]))) * balanceData[i]["usdPrice"]).toFixed(2);
    labels.push(balanceData[i]["name"]);   
    balanceSeries.push(parseFloat(value));
    //totalBalance += value;
  }

  const options = {
    labels: labels,
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
      labels: {colors: "#FFFFFF"},
    },
  };

  if (balanceData.length === 0) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
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
