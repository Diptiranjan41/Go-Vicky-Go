// src/context/CurrencyContext.jsx
import { createContext, useState, useContext } from "react";

// Create the context
export const CurrencyContext = createContext();

const exchangeRates = {
  INR: { rate: 1, symbol: "₹" },
  USD: { rate: 0.012, symbol: "$" },
  EUR: { rate: 0.011, symbol: "€" },
  GBP: { rate: 0.0094, symbol: "£" },
  JPY: { rate: 1.94, symbol: "¥" },
  AUD: { rate: 0.018, symbol: "A$" },
  CAD: { rate: 0.016, symbol: "C$" },
  CHF: { rate: 0.011, symbol: "CHF" },
  CNY: { rate: 0.088, symbol: "¥" },
  HKD: { rate: 0.094, symbol: "HK$" },
  NZD: { rate: 0.020, symbol: "NZ$" },
  SEK: { rate: 0.12, symbol: "kr" },
  SGD: { rate: 0.016, symbol: "S$" },
  KRW: { rate: 16.5, symbol: "₩" },
  ZAR: { rate: 0.23, symbol: "R" },
  BRL: { rate: 0.065, symbol: "R$" },
  RUB: { rate: 1.05, symbol: "₽" },
  MXN: { rate: 0.20, symbol: "Mex$" },
  TWD: { rate: 0.38, symbol: "NT$" },
  THB: { rate: 0.44, symbol: "฿" },
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  return (
    <CurrencyContext.Provider
      value={{ selectedCurrency, setSelectedCurrency, exchangeRates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// ✅ Add this hook to fix the error
export const useCurrency = () => useContext(CurrencyContext);
