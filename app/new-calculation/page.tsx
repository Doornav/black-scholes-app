"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getCurrentUser, getAuthToken } from "@/lib/firebase/auth";

export default function NewCalculation() {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    stockPrice: "",
    strikePrice: "",
    interestRate: "",
    timeToExpiration: "",
    volatility: "",
  });
  
  const [result, setResult] = useState<null | { optionPrice: number }>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const resError = await response.json();
        throw new Error(resError.error || "Calculation failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-xl mx-auto bg-white rounded shadow px-6 py-8 border border-green-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">New Calculation</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="stockPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Price (S)
            </label>
            <input
              type="number"
              id="stockPrice"
              name="stockPrice"
              placeholder="Entered stock price"
              value={inputs.stockPrice}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="strikePrice"
              className="block text-sm font-medium text-gray-700"
            >
              Strike Price (K)
            </label>
            <input
              type="number"
              id="strikePrice"
              name="strikePrice"
              placeholder="Enter strike price"
              value={inputs.strikePrice}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="interestRate"
              className="block text-sm font-medium text-gray-700"
            >
              Interest Rate (r) %
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              placeholder="Enter annual interest rate"
              value={inputs.interestRate}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="timeToExpiration"
              className="block text-sm font-medium text-gray-700"
            >
              Time to Expiration (T in years)
            </label>
            <input
              type="number"
              id="timeToExpiration"
              name="timeToExpiration"
              placeholder="Enter time to expiration"
              value={inputs.timeToExpiration}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="volatility"
              className="block text-sm font-medium text-gray-700"
            >
              Volatility (σ) %
            </label>
            <input
              type="number"
              id="volatility"
              name="volatility"
              placeholder="Enter volatility"
              value={inputs.volatility}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <Button type="submit">Calculate</Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold">Calculation Result</h2>
            <p>Option Price: ${result.optionPrice.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}