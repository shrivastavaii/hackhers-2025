import { Line } from "react-chartjs-2";
import { forwardRef, ForwardedRef } from "react";
import type { Chart } from "chart.js"; // ✅ Correctly importing Chart type

const LineChart = forwardRef((props: any, ref: ForwardedRef<Chart | null>) => {
  return <Line ref={ref} {...props} />;
});

LineChart.displayName = "LineChart";

export default LineChart;
