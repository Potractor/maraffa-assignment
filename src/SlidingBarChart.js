import React, { useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
// Register the necessary chart components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

const SlidingBarChart = () => {
  const chartRef = useRef(null);
  const [drilldown, setDrilldown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const billingDay = 1; // Billing day set to 1

  // Monthly data for Jan to March
  const monthlyData = [
    { month: "January", usage: 20 }, // GB
    { month: "February", usage: 18 },
    { month: "March", usage: 25 },
  ];

  // Example daily data for 3 months
  const dailyData = [
    { day: "Jan 1", usage: 0.5 },
    { day: "Jan 2", usage: 1.2 },
    { day: "Jan 3", usage: 0.9 },
    // Additional daily data here...
    { day: "Mar 1", usage: 0.4 },
    { day: "Mar 31", usage: 1.9 },
    { day: "Jan 1", usage: 0.5 },
    { day: "Jan 2", usage: 1.2 },
    { day: "Jan 3", usage: 0.9 },
    // Additional daily data here...
    { day: "Mar 1", usage: 0.4 },
    { day: "Mar 31", usage: 1.9 },
    { day: "Jan 1", usage: 0.5 },
    { day: "Jan 2", usage: 1.2 },
    { day: "Jan 3", usage: 0.9 },
    // Additional daily data here...
    { day: "Mar 1", usage: 0 },
    { day: "Mar 31", usage: 0 },
    { day: "Jan 1", usage: 0 },
    { day: "Jan 2", usage: 0 },
    { day: "Jan 3", usage: 0.9 },
    // Additional daily data here...
    { day: "Mar 1", usage: 0.4 },
    { day: "Mar 31", usage: 1.9 },
    { day: "Jan 1", usage: 0.5 },
    { day: "Jan 2", usage: 1.2 },
    { day: "Jan 3", usage: 0.9 },
    // Additional daily data here...
    { day: "Mar 1", usage: 0.4 },
    { day: "Mar 31", usage: 1.9 },
    // Populate with daily data
  ];
  function createDiagonalPattern(color = "black") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const size = 10;
    const stroke = 4;
    const strokeOffset = stroke / 2;
    canvas.width = size;
    canvas.height = size;

    context.strokeStyle = color; // 'rgba(0, 0, 0, 1)';
    context.lineWidth = stroke;

    // the offset is needed because of antialisaing. We always want to draw outside the edge
    context.moveTo(size / 2 - strokeOffset, -strokeOffset);
    context.lineTo(size + strokeOffset, size / 2 + strokeOffset);
    context.moveTo(-strokeOffset, size / 2 - strokeOffset);
    context.lineTo(size / 2 + strokeOffset, size + strokeOffset);
    context.stroke();
    // context.scale(1 / 10, 1 / 10);

    // return canvas;
    return context.createPattern(canvas, "repeat");
  }
  const chartData = drilldown
    ? {
        labels: dailyData.map((item) => item.day),
        datasets: [
          {
            label: "Daily Data Usage",
            data: dailyData.map((item) => item.usage),
            backgroundColor: createDiagonalPattern("rgba(75, 192, 192, 0.6)"),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            minBarLength: 4,
          },
        ],
      }
    : {
        labels: monthlyData.map((item) => item.month),
        datasets: [
          {
            label: "Monthly Data Usage",
            data: monthlyData.map((item) => item.usage),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

  // Add symbol for billing day
  const billingDayIndex = drilldown
    ? dailyData.findIndex((data) => new Date(data.day).getDate() === billingDay)
    : -1;

  const billingDayAnnotations =
    billingDayIndex !== -1
      ? [
          {
            type: "box",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderWidth: 1,
            borderColor: "#F27173",
            yMin: drilldown
              ? dailyData[billingDayIndex].usage
              : monthlyData[billingDayIndex].usage,
            yMax: drilldown
              ? dailyData[billingDayIndex].usage
              : monthlyData[billingDayIndex].usage,
            xMax: drilldown
              ? dailyData[billingDayIndex].day
              : monthlyData[billingDayIndex].month,
            xMin: drilldown
              ? dailyData[billingDayIndex].day
              : monthlyData[billingDayIndex].month,
            label: {
              display: true,
              content: "✅",
              position: "center",
              color: "#F27173",
              font: {
                size: 16,
              },
            },
          },
        ]
      : [];

  // Chart.js options
  const options = {
    responsive: true,
    onClick: (e, elements) => {
      if (!drilldown && elements.length) {
        const month = elements[0].index;
        setDrilldown(true);
        setSelectedMonth(month);
      }
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: drilldown ? "Day" : "Month" },
        min: 0,
        max: drilldown ? 10 : monthlyData.length - 1,
        ticks: {
          color: (context) => {
            // Accessing label to check if it is "Jan 1" for custom color
            const dateLabel = context.tick.label.replace("#", ""); // Remove prefix
            return dateLabel === "Jan 1" ? "#F45834" : "#000000"; // Custom color for Jan 1, default for others
          },
        },
      },
      y: {
        grid: { display: false },
        title: { display: true, text: "Usage (GB)" },
        ticks: {
          callback: (value) =>
            value < 1
              ? `${(value * 1024).toFixed(2)} MB`
              : `${value.toFixed(2)} GB`,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: billingDayAnnotations,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return value < 1
              ? `${(value * 1024).toFixed(2)} MB`
              : `${value.toFixed(2)} GB`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Pan only along the x-axis
          threshold: 10,
        },
        zoom: {
          mode: "x", // Apply zoom only along the x-axis
          speed: 0.1, // Adjust zoom speed (0.1 for slower, 1 for faster)
          limits: {
            x: { min: 5, max: 10 }, // Enforce a minimum zoom range on the x-axis
          },
        },
      },
    },
  };

  // Scroll functions
  const scrollLeft = () => {
    const chart = chartRef.current;
    let tooltipEl = document.getElementById("chartjs-tooltip");
    console.log(tooltipEl[]);
    if (chart) {
      chart.pan({ x: -70 }, undefined, "default"); // Pan the chart 70 pixels to the left
    }
  };

  const scrollRight = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.pan({ x: 70 }, undefined, "default"); // Pan the chart 70 pixels to the right
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <button
          className="btn"
          style={{ display: "none" }}
          onClick={scrollLeft}
        >
          ← Scroll Left
        </button>
        <button onClick={scrollRight} style={{ marginLeft: "10px" }}>
          Scroll Right →
        </button>
      </div>
      <Bar
        ref={chartRef}
        data={chartData}
        options={options}
        key={Math.random().toString(36)}
      />
      {drilldown && (
        <button
          onClick={() => {
            setDrilldown(false);
            setSelectedMonth(null);
          }}
        >
          Back to Monthly View
        </button>
      )}
    </div>
  );
};

export default SlidingBarChart;
