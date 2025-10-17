import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  DollarSign,
  Calendar,
  Zap,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FutureWealthCalculator = () => {
  const [formData, setFormData] = useState({
    currentPortfolio: 2500000,
    lumpsumYearly: 300000,
    monthlySIP: 20000,
    expectedReturn: 13,
    years: 20,
  });

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    calculateFutureWealth();
  }, [formData]);

  useEffect(() => {
    if (results) {
      setChartData({
        labels: [
          "Current Portfolio",
          "Lumpsum Investments",
          "SIP Investments",
          "Wealth Gained",
        ],
        datasets: [
          {
            data: [
              results.futureValueCurrent,
              results.futureValueLumpsum,
              results.futureValueSIP,
              results.estimatedReturn,
            ],
            backgroundColor: ["#ec4899", "#3b82f6", "#10b981", "#f59e0b"],
            borderColor: ["#db2777", "#2563eb", "#059669", "#d97706"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [results]);

  const calculateFutureWealth = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const {
        currentPortfolio,
        lumpsumYearly,
        monthlySIP,
        expectedReturn,
        years,
      } = formData;

      // --- Corrected Formulae ---
      const annualRate = expectedReturn / 100;
      const monthlyRate = annualRate / 12;

      // 1️⃣ Future Value of current portfolio
      const futureValueCurrent =
        currentPortfolio * Math.pow(1 + annualRate, years);

      // 2️⃣ Future Value of yearly lumpsum (ordinary annuity)
      // Each year's lumpsum grows for (years - t) years
      const futureValueLumpsum =
        lumpsumYearly * ((Math.pow(1 + annualRate, years) - 1) / annualRate);

      // 3️⃣ Future Value of monthly SIP (monthly compounding)
      const futureValueSIP =
        monthlySIP *
        ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate) *
        (1 + monthlyRate);

      // Totals
      const totalWealth =
        futureValueCurrent + futureValueLumpsum + futureValueSIP;
      const totalInvested =
        currentPortfolio + lumpsumYearly * years + monthlySIP * years * 12;
      const estimatedReturn = totalWealth - totalInvested;

      setResults({
        totalWealth,
        totalInvested,
        estimatedReturn,
        futureValueCurrent,
        futureValueLumpsum,
        futureValueSIP,
        years,
      });
      setIsCalculating(false);
    }, 500);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatInput = (value) => new Intl.NumberFormat("en-IN").format(value);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <Target className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Future Wealth Calculator
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-500" />
            Your Investment Details
          </h2>

          {/* Sliders */}
          <div className="space-y-6">
            {/* Current Portfolio */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <DollarSign className="inline-block w-5 h-5 text-green-500 mr-2" />
                Current Portfolio Value (₹)
              </label>
              <input
                type="range"
                value={formData.currentPortfolio}
                onChange={(e) =>
                  handleChange("currentPortfolio", e.target.value)
                }
                min="100000"
                max="50000000"
                step="100000"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                ₹{formatInput(formData.currentPortfolio)}
              </div>
            </div>

            {/* Lumpsum */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <BarChart3 className="inline-block w-5 h-5 text-blue-500 mr-2" />
                Yearly Lumpsum Investment (₹)
              </label>
              <input
                type="range"
                value={formData.lumpsumYearly}
                onChange={(e) => handleChange("lumpsumYearly", e.target.value)}
                min="0"
                max="10000000"
                step="100000"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                ₹{formatInput(formData.lumpsumYearly)}
              </div>
            </div>

            {/* SIP */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <TrendingUp className="inline-block w-5 h-5 text-purple-500 mr-2" />
                Monthly SIP Investment (₹)
              </label>
              <input
                type="range"
                value={formData.monthlySIP}
                onChange={(e) => handleChange("monthlySIP", e.target.value)}
                min="0"
                max="2000000"
                step="10000"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                ₹{formatInput(formData.monthlySIP)}
              </div>
            </div>

            {/* Return */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Zap className="inline-block w-5 h-5 text-yellow-500 mr-2" />
                Expected Annual Return (%)
              </label>
              <input
                type="range"
                value={formData.expectedReturn}
                onChange={(e) => handleChange("expectedReturn", e.target.value)}
                min="1"
                max="25"
                step="0.5"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.expectedReturn}%
              </div>
            </div>

            {/* Years */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline-block w-5 h-5 text-red-500 mr-2" />
                Investment Period (Years)
              </label>
              <input
                type="range"
                value={formData.years}
                onChange={(e) => handleChange("years", e.target.value)}
                min="1"
                max="40"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.years} years
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                Your Future Wealth
              </h2>

              <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                <p className="text-lg font-medium mb-2">Your Wealth will be</p>
                {isCalculating ? (
                  <div className="text-2xl font-bold py-4">Calculating...</div>
                ) : (
                  <motion.div
                    key={results.totalWealth}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold mb-2"
                  >
                    {formatCurrency(results.totalWealth)}
                  </motion.div>
                )}
                <p className="text-lg font-medium">
                  after {results.years} years
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Total Invested</p>
                  <p className="text-blue-600 font-bold text-xl mt-1">
                    {formatCurrency(results.totalInvested)}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Wealth Gained</p>
                  <p className="text-amber-600 font-bold text-xl mt-1">
                    {formatCurrency(results.estimatedReturn)}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-4 bg-gray-50 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Investment Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Portfolio:</span>
                    <span>{formatCurrency(results.futureValueCurrent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lumpsum Investments:</span>
                    <span>{formatCurrency(results.futureValueLumpsum)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SIP Investments:</span>
                    <span>{formatCurrency(results.futureValueSIP)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-semibold">Total Wealth:</span>
                    <span className="text-green-600 font-bold">
                      {formatCurrency(results.totalWealth)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {chartData && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Wealth Composition
                  </h3>
                  <div className="max-w-xs mx-auto">
                    <Pie data={chartData} />
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FutureWealthCalculator;
