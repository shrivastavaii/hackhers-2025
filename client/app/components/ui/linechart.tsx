"use client";

import { forwardRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";

// ✅ Fix: Use `ChartJS | null` for the ref type
const LineChart = forwardRef<ChartJS | null, any>((props, ref) => (
  <Line ref={ref} {...props} />
));

LineChart.displayName = "LineChart";

export default LineChart;
