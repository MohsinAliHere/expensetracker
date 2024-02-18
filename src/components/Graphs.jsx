import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { Stack } from "@mui/material";

const Graphs = ({ Attest }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current !== null) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(Attest),
        datasets: [
          {
            label: "Amount",
            data: Object.values(Attest),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current !== null) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [Attest]);

  return (
    <Stack  >
      <canvas ref={chartRef} />;
    </Stack>
  )
};

export default Graphs;
