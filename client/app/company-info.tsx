"use client"

import { useState } from "react"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"

interface Company {
  Symbol: string;
  Name: string;
  Price: number;
  RevenueGrowth: number;
}

// Explicitly type `sp500Data` as an array of `Company`
const sp500Data: Company[] = [
  { Symbol: "AAPL", Name: "Apple Inc.", Price: 150.25, RevenueGrowth: 5.5 },
  { Symbol: "MSFT", Name: "Microsoft Corporation", Price: 280.75, RevenueGrowth: 4.2 },
  { Symbol: "AMZN", Name: "Amazon.com Inc.", Price: 3200.5, RevenueGrowth: 7.8 },
  // Add more companies here
];

// Ensure `findCompanyInfo` recognizes `company.Price` as a number
function findCompanyInfo(symbol: string): { price: number; revenueGrowth: number } | null {
  const company = sp500Data.find((c) => c.Symbol.toLowerCase() === symbol.toLowerCase());
  return company ? { price: company.Price, revenueGrowth: company.RevenueGrowth } : null;
}

export default function CompanyInfo() {
  const [symbol, setSymbol] = useState("")
  const [companyInfo, setCompanyInfo] = useState<{ price: number; revenueGrowth: number } | null>(null)

  const handleSymbolChange = (value: string) => {
    setSymbol(value)
    const info = findCompanyInfo(value)
    if (info) {
      setCompanyInfo(info)
    } else {
      setCompanyInfo(null)
    }
  }

  return (
    <Card
    className={`w-full max-w-md ${
      companyInfo
        ? companyInfo.revenueGrowth > 0
          ? "bg-green-100 border border-green-300"
          : "bg-red-100 border border-red-300"
        : "bg-gray-100 border border-gray-300"
    }`}
  >
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Enter a stock symbol to view company details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
            />
          </div>
          {companyInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Company Details</h3>
              <p>Current Price: ${companyInfo.price.toFixed(2)}</p>
              <p>Revenue Growth: {companyInfo.revenueGrowth.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

