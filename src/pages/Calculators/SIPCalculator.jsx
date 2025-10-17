import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  PieChart,
  Info,
  BarChart2,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SIPCalculator = () => {
  const [activeTab, setActiveTab] = useState("sip");
  const [formData, setFormData] = useState({
    monthlyInvestment: 25000,
    annualStepUp: 10,
    expectedReturn: 12,
    duration: 10,
    lumpsumAmount: 100000,
  });
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Calculate results whenever formData changes
  useEffect(() => {
    if (activeTab === "sip") {
      calculateSIP();
    } else if (activeTab === "stepup") {
      calculateStepUpSIP();
    } else if (activeTab === "lumpsum") {
      calculateLumpsum();
    }
  }, [formData, activeTab]);

  useEffect(() => {
    if (results) {
      setChartData({
        labels: ["Invested Amount", "Estimated Returns"],
        datasets: [
          {
            data: [results.investedAmount, results.estimatedReturn],
            backgroundColor: ["#ec4899", "#3b82f6"], // Pink and Blue colors
            borderColor: ["#db2777", "#2563eb"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [results]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const calculateSIP = () => {
    const { monthlyInvestment, expectedReturn, duration } = formData;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = duration * 12;

    const futureValue =
      monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate));

    const investedAmount = monthlyInvestment * months;
    const estimatedReturn = futureValue - investedAmount;

    setResults({
      investedAmount,
      estimatedReturn,
      totalValue: futureValue,
    });
  };

  const calculateStepUpSIP = () => {
    const { monthlyInvestment, annualStepUp, expectedReturn, duration } =
      formData;
    let futureValue = 0;
    let currentInvestment = monthlyInvestment;
    const monthlyRate = expectedReturn / 12 / 100;
    const stepUpRate = annualStepUp / 100;
    const months = duration * 12;
    let investedAmount = 0;

    for (let year = 0; year < duration; year++) {
      const monthsInYear = year < duration - 1 ? 12 : months % 12 || 12;

      for (let month = 1; month <= monthsInYear; month++) {
        futureValue +=
          currentInvestment *
          Math.pow(1 + monthlyRate, duration * 12 - (year * 12 + month) + 1);
      }

      investedAmount += currentInvestment * monthsInYear;
      currentInvestment *= 1 + stepUpRate;
    }

    const estimatedReturn = futureValue - investedAmount;

    setResults({
      investedAmount,
      estimatedReturn,
      totalValue: futureValue,
    });
  };

  const calculateLumpsum = () => {
    const { lumpsumAmount, expectedReturn, duration } = formData;
    const futureValue =
      lumpsumAmount * Math.pow(1 + expectedReturn / 100, duration);
    const estimatedReturn = futureValue - lumpsumAmount;

    setResults({
      investedAmount: lumpsumAmount,
      estimatedReturn,
      totalValue: futureValue,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <Calculator className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Mutual Fund Investment Calculator
        </h1>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {["sip", "lumpsum", "stepup"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab === "sip" && "SIP Calculator"}
            {tab === "lumpsum" && "Lumpsum Calculator"}
            {tab === "stepup" && "Step-Up SIP"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.form
          key={`form-${activeTab}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          {activeTab === "sip" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Monthly Investment (₹)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="monthlyInvestment"
                    value={formData.monthlyInvestment}
                    onChange={handleChange}
                    min="1000"
                    max="100000"
                    step="1000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[80px]">
                    ₹{formData.monthlyInvestment.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    step="0.5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[40px]">
                    {formData.expectedReturn}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Investment Duration (years)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[30px]">
                    {formData.duration}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "stepup" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <ArrowUp className="w-5 h-5 text-green-500" />
                    Initial Monthly Investment (₹)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="monthlyInvestment"
                    value={formData.monthlyInvestment}
                    onChange={handleChange}
                    min="1000"
                    max="100000"
                    step="1000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[80px]">
                    ₹{formData.monthlyInvestment.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Annual Step-up (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="annualStepUp"
                    value={formData.annualStepUp}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[30px]">
                    {formData.annualStepUp}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    step="0.5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[40px]">
                    {formData.expectedReturn}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Investment Duration (years)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[30px]">
                    {formData.duration}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "lumpsum" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    Investment Amount (₹)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="lumpsumAmount"
                    value={formData.lumpsumAmount}
                    onChange={handleChange}
                    min="10000"
                    max="10000000"
                    step="10000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[100px]">
                    ₹{formData.lumpsumAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹10,000</span>
                  <span>₹1,00,00,000</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    step="0.5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[40px]">
                    {formData.expectedReturn}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Investment Duration (years)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium min-w-[30px]">
                    {formData.duration}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
            </>
          )}
        </motion.form>

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
                <BarChart2 className="w-6 h-6 text-blue-500" />
                Investment Results
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600 font-medium">Invested Amount</p>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      {formatCurrency(results.investedAmount)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Total principal invested
                    </p>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-gray-600 font-medium">
                      Estimated Returns
                    </p>
                    <p className="text-pink-600 font-bold text-xl mt-1">
                      {formatCurrency(results.estimatedReturn)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Wealth gained</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Total Value</p>
                  <p className="text-purple-600 font-bold text-2xl mt-1">
                    {formatCurrency(results.totalValue)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Future value of investment
                  </p>
                </div>

                {chartData && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Investment Breakdown
                    </h3>
                    <div className="max-w-xs mx-auto">
                      <Pie data={chartData} />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">
                          Invested:{" "}
                          {(
                            (results.investedAmount / results.totalValue) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span className="text-sm">
                          Returns:{" "}
                          {(
                            (results.estimatedReturn / results.totalValue) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center"
            >
              <div className="text-center">
                <Calculator className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  Enter your investment details to see projected returns
                </h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Information Sections */}
      <div className="mt-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-500" />
            What is a SIP Calculator?
          </h2>
          <p className="text-gray-600 mb-4">
            A SIP (Systematic Investment Plan) calculator is an online tool that
            helps you estimate the potential returns on your mutual fund
            investments made through SIP. It takes into account your monthly
            investment amount, the expected rate of return, and the investment
            duration to project the future value of your investments.
          </p>
          <p className="text-gray-600">
            SIP calculators are particularly useful for financial planning as
            they help you visualize how small, regular investments can grow over
            time due to the power of compounding.
          </p>
        </motion.div>

        {activeTab === "sip" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              How Does the SIP Calculator Work?
            </h3>
            <p className="text-gray-600 mb-4">
              The SIP calculator uses the following formula to estimate returns:
            </p>
            <div className="bg-white p-4 rounded-lg mb-4 font-mono text-sm">
              FV = P × [ (1 + r)^n - 1 ] / r × (1 + r)
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>
                • <span className="font-medium">FV</span>: Future Value of the
                investment
              </li>
              <li>
                • <span className="font-medium">P</span>: Monthly investment
                amount
              </li>
              <li>
                • <span className="font-medium">r</span>: Expected monthly rate
                of return (annual rate/12)
              </li>
              <li>
                • <span className="font-medium">n</span>: Total number of months
                (years × 12)
              </li>
            </ul>
          </motion.div>
        )}

        {activeTab === "stepup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-green-600" />
              What is a Step-Up SIP Calculator?
            </h3>
            <p className="text-gray-600 mb-4">
              A Step-Up SIP calculator helps you estimate the returns on your
              SIP investments where you increase your investment amount annually
              by a fixed percentage. This strategy allows you to align your
              investments with your growing income, potentially helping you
              achieve your financial goals faster.
            </p>
            <p className="text-gray-600">
              The calculator shows how increasing your SIP amount periodically
              can significantly boost your returns over time compared to a
              regular SIP with fixed monthly investments.
            </p>
          </motion.div>
        )}

        {activeTab === "lumpsum" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              What is a Lumpsum Calculator?
            </h3>
            <p className="text-gray-600 mb-4">
              A lumpsum calculator helps you estimate the future value of a
              one-time investment in mutual funds based on the expected rate of
              return and investment duration. It uses the compound interest
              formula to project how your investment might grow over time.
            </p>
            <div className="bg-white p-4 rounded-lg mb-4 font-mono text-sm">
              FV = P × (1 + r)^n
            </div>
            <ul className="text-gray-600 space-y-2">
              <li>
                • <span className="font-medium">FV</span>: Future Value of the
                investment
              </li>
              <li>
                • <span className="font-medium">P</span>: Principal investment
                amount
              </li>
              <li>
                • <span className="font-medium">r</span>: Expected annual rate
                of return
              </li>
              <li>
                • <span className="font-medium">n</span>: Investment duration in
                years
              </li>
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-500" />
            Benefits of Using the Investment Calculator
          </h2>
          <ul className="text-gray-600 space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Financial Planning:</strong> Helps you plan your
                investments based on financial goals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Visualization:</strong> Shows how small investments can
                grow significantly over time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Comparison:</strong> Allows you to compare different
                investment scenarios
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Goal Setting:</strong> Helps determine how much to
                invest to reach specific financial targets
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-500" />
            Who Should Use the Investment Calculator?
          </h2>
          <ul className="text-gray-600 space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Beginners:</strong> Those new to investing who want to
                understand potential returns
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Experienced Investors:</strong> Those who want to
                fine-tune their investment strategies
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Retirement Planners:</strong> Those planning for
                long-term financial security
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <strong>Goal-oriented Investors:</strong> Those saving for
                specific goals like education, home purchase, etc.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SIPCalculator;
