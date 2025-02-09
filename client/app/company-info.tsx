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
  { Symbol: "AMZN", Name: "Amazon.com Inc.", Price: 3200.5, RevenueGrowth: -7.8 },
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
          ? "bg-gradient-to-r from-darkTeal via-midTeal to-darkTeal border border-none"
          : "bg-gradient-to-r from-darkTeal via-midTeal to-darkTeal border border-none"
        : "bg-gradient-to-r from-darkTeal via-midTeal to-darkTeal border border-none"
    }`}
  >
      <CardHeader>
        <CardTitle className="text-white">Company Information</CardTitle>
        <CardDescription className="text-white">Enter a stock symbol to view company details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            
            <Input
              id="symbol"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
            />
          </div>
          {companyInfo && (
            <div>
              <h3 className="!font-extrabold text-lg text-white mb-2">
              {sp500Data.find((c) => c.Symbol.toLowerCase() === symbol.toLowerCase())?.Name || symbol.toUpperCase()} 
            </h3>

              <p className="text-white">
                Current Price: ${companyInfo.price.toFixed(2)}
              </p>

              <p className={companyInfo.revenueGrowth >= 0 ? "text-green-400" : "text-red-400"}>
                Revenue Growth: {companyInfo.revenueGrowth.toFixed(2)}%
              </p>

            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

