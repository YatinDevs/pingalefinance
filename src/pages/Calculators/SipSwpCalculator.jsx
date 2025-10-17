import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  TrendingUp,
  ArrowDownRight,
  Calculator,
  Calendar,
  Zap,
  PieChart,
  DollarSign,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const SipSwpCalculator = () => {
  const [formData, setFormData] = useState({
    monthlySIP: 5000,
    sipYears: 20,
    withdrawalYears: 20,
    sipReturn: 12,
    swpReturn: 7,
  });

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    calculateSipSwp();
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const calculateSipSwp = () => {
    const { monthlySIP, sipYears, withdrawalYears, sipReturn, swpReturn } =
      formData;

    const sipRate = sipReturn / 100 / 12;
    const swpRate = swpReturn / 100 / 12;

    // 1️⃣ Accumulated Corpus after SIP period
    const monthsSIP = sipYears * 12;
    const accumulatedCorpus =
      monthlySIP *
      ((Math.pow(1 + sipRate, monthsSIP) - 1) / sipRate) *
      (1 + sipRate);

    // 2️⃣ Monthly SWP (Withdrawal)
    const monthsSWP = withdrawalYears * 12;
    const monthlyWithdrawal =
      (accumulatedCorpus * swpRate) / (1 - Math.pow(1 + swpRate, -monthsSWP));

    // 3️⃣ Total Withdrawn over period
    const totalWithdrawal = monthlyWithdrawal * monthsSWP;

    setResults({
      accumulatedCorpus,
      monthlyWithdrawal,
      totalWithdrawal,
    });

    setChartData({
      labels: ["Accumulated Corpus", "Total Withdrawn"],
      datasets: [
        {
          data: [accumulatedCorpus, totalWithdrawal],
          backgroundColor: ["#3b82f6", "#10b981"],
          borderColor: ["#2563eb", "#059669"],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2"
      >
        <Calculator className="w-7 h-7 text-blue-600" />
        SIP Today… SWP Tomorrow
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Investment Inputs
          </h2>

          <div className="space-y-5">
            {/* Monthly SIP */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Monthly SIP Amount (₹)
              </label>
              <input
                type="range"
                value={formData.monthlySIP}
                onChange={(e) => handleChange("monthlySIP", e.target.value)}
                min="1000"
                max="200000"
                step="1000"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                ₹{formData.monthlySIP.toLocaleString("en-IN")}
              </div>
            </div>

            {/* SIP Period */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                SIP Period (Years)
              </label>
              <input
                type="range"
                value={formData.sipYears}
                onChange={(e) => handleChange("sipYears", e.target.value)}
                min="1"
                max="40"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.sipYears} years
              </div>
            </div>

            {/* Withdrawal Period */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Withdrawal Period (Years)
              </label>
              <input
                type="range"
                value={formData.withdrawalYears}
                onChange={(e) =>
                  handleChange("withdrawalYears", e.target.value)
                }
                min="1"
                max="40"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.withdrawalYears} years
              </div>
            </div>

            {/* SIP Return */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Assumed Return During SIP Period (%)
              </label>
              <input
                type="range"
                value={formData.sipReturn}
                onChange={(e) => handleChange("sipReturn", e.target.value)}
                min="1"
                max="25"
                step="0.5"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.sipReturn}%
              </div>
            </div>

            {/* SWP Return */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Assumed Return During Withdrawal Period (%)
              </label>
              <input
                type="range"
                value={formData.swpReturn}
                onChange={(e) => handleChange("swpReturn", e.target.value)}
                min="1"
                max="15"
                step="0.5"
                className="w-full"
              />
              <div className="text-right text-gray-700 font-medium">
                {formData.swpReturn}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowDownRight className="w-6 h-6 text-emerald-500" />
                Your Results
              </h2>

              <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white text-center mb-6">
                <p className="text-lg mb-2 font-medium">
                  Your Accumulated Corpus will be
                </p>
                <motion.p
                  key={results.accumulatedCorpus}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold mb-2"
                >
                  {formatCurrency(results.accumulatedCorpus)}
                </motion.p>
                <p className="text-lg">
                  after <b>{formData.sipYears}</b> years
                </p>
              </div>

              <div className="p-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white text-center">
                <p className="text-lg mb-2 font-medium">
                  You will receive Monthly
                </p>
                <motion.p
                  key={results.monthlyWithdrawal}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold mb-2"
                >
                  {formatCurrency(results.monthlyWithdrawal)}
                </motion.p>
                <p className="text-lg">
                  for <b>{formData.withdrawalYears}</b> years
                </p>
              </div>

              {/* Chart */}
              {chartData && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-gray-600" />
                    Investment Visualization
                  </h3>
                  <div className="max-w-xs mx-auto">
                    <Pie data={chartData} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SipSwpCalculator;
