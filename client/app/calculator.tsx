"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Alert, AlertDescription } from "./components/ui/alert"
import LineChart from "./components/ui/linechart";
import { motion } from "framer-motion"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import { Line } from "react-chartjs-2"
import { fetchStockData, fetchHistoricalData } from "@/lib/stock-data"
import CompanyInfo from "./company-info"; 


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const erf = (x: number): number => {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const sign = x >= 0 ? 1 : -1
  const xAbs = Math.abs(x)
  const t = 1 / (1 + p * xAbs)
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-xAbs * xAbs)
  return sign * y
}

const normCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

const normPDF = (x: number): number => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

const calculateD1D2 = (S: number, K: number, r: number, T: number, sigma: number): { d1: number; d2: number } => {
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T))
  const d2 = d1 - sigma * Math.sqrt(T)
  return { d1, d2 }
}

const blackScholes = (S: number, K: number, r: number, T: number, sigma: number, optionType: string): number => {
  const { d1, d2 } = calculateD1D2(S, K, r, T, sigma)
  if (optionType === "C") {
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2)
  } else {
    return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1)
  }
}

const calculateGreeks = (
  S: number,
  K: number,
  r: number,
  T: number,
  sigma: number,
  optionType: string,
): { delta: number; gamma: number; theta: number; vega: number } => {
  const { d1, d2 } = calculateD1D2(S, K, r, T, sigma)
  const delta = optionType === "C" ? normCDF(d1) : normCDF(d1) - 1
  const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T))
  const theta =
    optionType === "C"
      ? -(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)
      : -(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCDF(-d2)
  const vega = S * normPDF(d1) * Math.sqrt(T)
  return { delta, gamma, theta, vega }
}

function impliedVolatility(targetPrice: number, S: number, K: number, r: number, T: number, optionType: string) {
  let sigma = 0.2 // Initial guess
  const tolerance = 1e-6
  const maxIterations = 100

  for (let i = 0; i < maxIterations; i++) {
    const price = blackScholes(S, K, r, T, sigma, optionType)
    const vega = calculateGreeks(S, K, r, T, sigma, optionType).vega

    if (Math.abs(price - targetPrice) < tolerance) {
      return sigma
    }

    sigma -= (price - targetPrice) / vega

    if (sigma <= 0) {
      sigma = 1e-4 // Prevent negative volatility
    }
  }

  return sigma
}

function generateSensitivityTable(S: number, K: number, r: number, T: number, sigma: number, optionType: string) {
  const sigmaRange = [sigma * 0.8, sigma * 0.9, sigma, sigma * 1.1, sigma * 1.2]
  const tRange = [T * 0.8, T * 0.9, T, T * 1.1, T * 1.2]

  return sigmaRange.map((s) => tRange.map((t) => blackScholes(S, K, r, t, s, optionType)))
}

interface InputState {
  S: number
  K: number
  r: number
  T: number
  sigma: number
  optionType: string
  marketPrice?: number
}

export default function OptionCalculator() {
  const [inputs, setInputs] = useState<InputState>({
    S: 100,
    K: 100,
    r: 0.05,
    T: 1,
    sigma: 0.2,
    optionType: "C",
    marketPrice: undefined,
  })
  const [price, setPrice] = useState<number | null>(null)
  const [greeks, setGreeks] = useState<{ delta: number; gamma: number; theta: number; vega: number } | null>(null)
  const [chartData, setChartData] = useState<{ labels: number[]; datasets: any[] }>({ labels: [], datasets: [] })
  const [impliedVol, setImpliedVol] = useState<number | null>(null)
  const [sensitivityTable, setSensitivityTable] = useState<number[][]>([])

  
  const chartRef = useRef<ChartJS | null>(null);

  const handleChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: name === "optionType" ? value : Number.parseFloat(value) || 0 }))
  }

  const calculatePrice = () => {
    try {
      const calculatedPrice = blackScholes(inputs.S, inputs.K, inputs.r, inputs.T, inputs.sigma, inputs.optionType)
      setPrice(calculatedPrice)
      setGreeks(calculateGreeks(inputs.S, inputs.K, inputs.r, inputs.T, inputs.sigma, inputs.optionType))
      generateChartData()

      if (inputs.marketPrice) {
        const iv = impliedVolatility(inputs.marketPrice, inputs.S, inputs.K, inputs.r, inputs.T, inputs.optionType)
        setImpliedVol(iv)
      } else {
        setImpliedVol(null)
      }

      const sensTable = generateSensitivityTable(
        inputs.S,
        inputs.K,
        inputs.r,
        inputs.T,
        inputs.sigma,
        inputs.optionType,
      )
      setSensitivityTable(sensTable)
    } catch (error) {
      console.error("Error calculating price:", error)
      setPrice(null)
      setGreeks(null)
      setImpliedVol(null)
      setSensitivityTable([])
    }
  }

  const resetInputs = () => {
    setInputs({
      S: 100,
      K: 100,
      r: 0.05,
      T: 1,
      sigma: 0.2,
      optionType: "C",
      marketPrice: undefined,
    })
    setPrice(null)
    setGreeks(null)
    setChartData({ labels: [], datasets: [] })
    setImpliedVol(null)
    setSensitivityTable([])
  }

  const generateChartData = () => {
    const prices: number[] = [];
    const deltas: number[] = [];
    const gammas: number[] = [];
    const thetas: number[] = [];
    const vegas: number[] = [];
  
    const stockPrices = Array.from({ length: 100 }, (_, i) => inputs.S * (0.8 + i * 0.04));
  
    stockPrices.forEach((S) => {
      const { delta, gamma, theta, vega } = calculateGreeks(S, inputs.K, inputs.r, inputs.T, inputs.sigma, inputs.optionType);
      prices.push(blackScholes(S, inputs.K, inputs.r, inputs.T, inputs.sigma, inputs.optionType));
      deltas.push(delta);
      gammas.push(gamma);
      thetas.push(theta);
      vegas.push(vega);
    });
  
    const newChartData = {
      labels: stockPrices,
      datasets: [
        {
          label: "Option Price",
          data: prices,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Delta",
          data: deltas,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y1",
        },
        {
          label: "Gamma",
          data: gammas,
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          yAxisID: "y1",
        },
        {
          label: "Theta",
          data: thetas,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          yAxisID: "y1",
        },
        {
          label: "Vega",
          data: vegas,
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          yAxisID: "y1",
        },
      ],
    };
  
    console.log("📊 Generated Chart Data:", newChartData); // ✅ Debugging
    setChartData(newChartData);
  };
  
  

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [])

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Black-Scholes Option Pricing Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(inputs).map(([key, value]) =>
              key !== "optionType" && key !== "marketPrice" ? (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-lg">
                    {key.toUpperCase()}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              ) : null,
            )}
            <div className="space-y-2">
              <Label htmlFor="optionType" className="text-lg">
                Option Type
              </Label>
              <Select value={inputs.optionType} onValueChange={(value) => handleChange("optionType", value)}>
                <SelectTrigger id="optionType" className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border border-gray-700 text-white rounded-md shadow-lg">
                {/* ✅ Customize Each Item (Text & Hover Effects) */}
                <SelectItem value="C" className="hover:bg-blue-600 hover:text-white p-2 rounded-md">
                    📈 Call Option
                </SelectItem>
                <SelectItem value="P" className="hover:bg-red-600 hover:text-white p-2 rounded-md">
                    📉 Put Option
                </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketPrice" className="text-lg">
                Market Price (optional)
              </Label>
              <Input
                id="marketPrice"
                name="marketPrice"
                type="number"
                value={inputs.marketPrice || ""}
                onChange={(e) => handleChange("marketPrice", e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
                placeholder="For Implied Volatility"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button onClick={calculatePrice} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Calculate
            </Button>
            <Button
              onClick={resetInputs}
              variant="outline"
              className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>
          {price !== null && (
            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-800 p-4 rounded-lg">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-400">Option Price</h4>
                  <p className="text-2xl font-bold text-blue-400">{price.toFixed(4)}</p>
                </div>
                {greeks &&
                  Object.entries(greeks).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <h4 className="text-lg font-semibold text-gray-400">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </h4>
                      <p className="text-2xl font-bold text-green-400">{value.toFixed(4)}</p>
                    </div>
                  ))}
                {impliedVol !== null && (
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-400">Implied Volatility</h4>
                    <p className="text-2xl font-bold text-purple-400">{impliedVol.toFixed(4)}</p>
                  </div>
                )}
              </div>
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: "400px" }}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Option Price and Greeks vs Underlying Asset Price
                    </h3>
                    {chartData.labels.length > 0 && (
                      <LineChart
                        ref={chartRef}
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top" as const,
                              labels: {
                                font: {
                                  size: 12,
                                  weight: "bold",
                                },
                              },
                            },
                            tooltip: {
                              mode: "index",
                              intersect: false,
                            },
                          },
                          scales: {
                            x: {
                              title: {
                                display: true,
                                text: "Underlying Asset Price",
                                font: {
                                  size: 14,
                                  weight: "bold",
                                },
                              },
                              ticks: {
                                font: {
                                  size: 10,
                                },
                              },
                            },
                            y: {
                              position: "left",
                              title: {
                                display: true,
                                text: "Option Price",
                                font: {
                                  size: 14,
                                  weight: "bold",
                                },
                              },
                              ticks: {
                                font: {
                                  size: 10,
                                },
                              },
                            },
                            y1: {
                              position: "right",
                              title: {
                                display: true,
                                text: "Greeks",
                                font: {
                                  size: 14,
                                  weight: "bold",
                                },
                              },
                              ticks: {
                                font: {
                                  size: 10,
                                },
                              },
                            },
                          },
                          interaction: {
                            mode: "nearest",
                            axis: "x",
                            intersect: false,
                          },
                        }}
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="sensitivity">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Sensitivity Analysis</h3>
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Volatility \ Time
                          </th>
                          {[0.8, 0.9, 1, 1.1, 1.2].map((t, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                              {(t * inputs.T).toFixed(2)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sensitivityTable.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {(inputs.sigma * [0.8, 0.9, 1, 1.1, 1.2][rowIndex]).toFixed(2)}
                            </th>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4">
                                {cell.toFixed(4)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <div className="p-6 max-w-6xl mx-auto text-black">
      <CompanyInfo />
      </div>
      </Card>
    </motion.div>
  )
}

