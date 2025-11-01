import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext"; // Adjust path if needed
import { formatCurrency } from "../../utils/formatCurrency"; // Adjust path if needed

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const AnnualSubscriptionPage = () => {
  const navigate = useNavigate();
  const { selectedCurrency, exchangeRates } = useCurrency();

  const prices = {
    normal: 999,
    pro: 2999,
    premium: 5999,
  };

  const features = {
    normal: ["Basic trip wizard", "12 draft trips", "Standard support"],
    pro: [
      "Unlimited trips",
      "Annual travel budget calculator",
      "Priority support",
      "Custom itineraries",
    ],
    premium: [
      "Exclusive travel deals",
      "Concierge tips",
      "Multi-country planner",
      "All Pro features",
    ],
  };

  // ✅ Corrected "billing" param
  const handleClick = (plan) => {
    navigate(`/payment?plan=${plan}&billing=annual`);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Annual Plans</h1>
          <p className="mt-4 text-lg text-cyan-300">
            Save more by subscribing yearly!
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {["normal", "pro", "premium"].map((plan) => {
            const title = plan.charAt(0).toUpperCase() + plan.slice(1);
            const price = formatCurrency(
              prices[plan],
              selectedCurrency,
              exchangeRates
            );
            const isPro = plan === "pro";

            return (
              <div
                key={plan}
                className={`relative flex flex-col rounded-2xl border ${
                  isPro
                    ? "border-cyan-400 bg-gray-950 shadow-xl"
                    : "border-gray-700 bg-gray-900"
                } shadow-lg p-6 hover:-translate-y-1 transition`}
              >
                {isPro && (
                  <div className="absolute -top-3 right-4 bg-yellow-400 text-xs font-semibold uppercase px-3 py-1 rounded-full shadow">
                    Best Value
                  </div>
                )}
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-3xl font-extrabold text-cyan-400">
                  {price} <span className="text-base font-medium">/year</span>
                </p>
                <ul className="mt-6 space-y-2 flex-1 text-sm">
                  {features[plan].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    onClick={() => handleClick(plan)}
                    className={`w-full px-4 py-3 text-sm font-semibold rounded-lg ${
                      isPro
                        ? "bg-cyan-600 text-black hover:bg-cyan-500"
                        : "border border-cyan-400 text-cyan-400 hover:bg-gray-800"
                    }`}
                  >
                    Choose {title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400">
            Prefer a shorter plan?{" "}
            <Link to="/getstarted" className="text-cyan-400 underline">
              View Monthly Plans
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnualSubscriptionPage;
