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
  Users,
  Shield,
  Clock,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RetirementCorpusCalculator = () => {
  const [formData, setFormData] = useState({
    currentExpense: 100000,
    inflation: 6,
    currentAge: 35,
    retirementAge: 60,
    lifeExpectancy: 90,
    earningReturn: 12,
    retirementReturn: 7,
    currentWealth: 1500000,
  });

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    calculateRetirementCorpus();
  }, [formData]);

  useEffect(() => {
    if (results) {
      setChartData({
        labels: ["Current Wealth", "SIP Contributions", "Shortfall"],
        datasets: [
          {
            data: [
              results.futureValueCurrentWealth,
              results.futureValueSIP,
              Math.max(
                0,
                results.corpusRequired -
                  results.futureValueCurrentWealth -
                  results.futureValueSIP
              ),
            ],
            backgroundColor: ["#1e3a8a", "#3b82f6", "#60a5fa"],
            borderColor: ["#1e40af", "#2563eb", "#3b82f6"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [results]);

  const calculateRetirementCorpus = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const {
        currentExpense,
        inflation,
        currentAge,
        retirementAge,
        lifeExpectancy,
        earningReturn,
        retirementReturn,
        currentWealth,
      } = formData;

      const yearsToRetirement = retirementAge - currentAge;
      const retirementYears = lifeExpectancy - retirementAge;

      // Calculate monthly expense at retirement (correct formula)
      const monthlyExpenseAtRetirement =
        currentExpense * Math.pow(1 + inflation / 100, yearsToRetirement);

      // Calculate retirement corpus using the correct formula
      // We need the corpus to generate monthly income that increases with inflation
      const monthlyReturnDuringRetirement = retirementReturn / 12 / 100;
      const monthlyInflation = inflation / 12 / 100;
      const monthsInRetirement = retirementYears * 12;

      // Calculate corpus using growing annuity formula
      let corpusRequired = 0;
      if (monthlyReturnDuringRetirement !== monthlyInflation) {
        corpusRequired =
          monthlyExpenseAtRetirement *
          ((1 -
            Math.pow(
              (1 + monthlyInflation) / (1 + monthlyReturnDuringRetirement),
              monthsInRetirement
            )) /
            (monthlyReturnDuringRetirement - monthlyInflation));
      } else {
        // When return equals inflation
        corpusRequired = monthlyExpenseAtRetirement * monthsInRetirement;
      }

      // Calculate future value of current wealth
      const futureValueCurrentWealth =
        currentWealth * Math.pow(1 + earningReturn / 100, yearsToRetirement);

      // Calculate monthly SIP required (CORRECTED FORMULA)
      const monthlyRate = earningReturn / 12 / 100;
      const monthsToRetirement = yearsToRetirement * 12;
      const shortfall = Math.max(0, corpusRequired - futureValueCurrentWealth);

      let monthlySIP = 0;
      if (shortfall > 0 && monthlyRate > 0) {
        monthlySIP =
          (shortfall * monthlyRate) /
          ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) *
            (1 + monthlyRate));
      }

      setResults({
        monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
        corpusRequired: Math.round(corpusRequired),
        monthlySIP: Math.round(monthlySIP),
        futureValueCurrentWealth: Math.round(futureValueCurrentWealth),
        futureValueSIP: Math.round(
          monthlySIP *
            (((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) /
              monthlyRate) *
              (1 + monthlyRate))
        ),
        yearsToRetirement,
        retirementYears,
        shortfall: Math.round(shortfall),
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatInput = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Retirement Corpus Calculator
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-500" />
            Your Retirement Details
          </h2>

          <div className="space-y-6">
            {/* Current Monthly Expense */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  Current Monthly Expense (₹)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.currentExpense}
                  onChange={(e) =>
                    handleChange("currentExpense", e.target.value)
                  }
                  min="10000"
                  max="500000"
                  step="10000"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[120px] text-right">
                  ₹{formatInput(formData.currentExpense)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Future Inflation */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Expected Inflation (%)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.inflation}
                  onChange={(e) => handleChange("inflation", e.target.value)}
                  min="3"
                  max="10"
                  step="0.5"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[40px]">
                  {formData.inflation}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Current Age */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Current Age (Years)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.currentAge}
                  onChange={(e) => handleChange("currentAge", e.target.value)}
                  min="20"
                  max="60"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[30px]">
                  {formData.currentAge}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20</span>
                <span>60</span>
              </div>
            </div>

            {/* Retirement Age */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Retirement Age (Years)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.retirementAge}
                  onChange={(e) =>
                    handleChange("retirementAge", e.target.value)
                  }
                  min={formData.currentAge + 1}
                  max="75"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[30px]">
                  {formData.retirementAge}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formData.currentAge + 1}</span>
                <span>75</span>
              </div>
            </div>

            {/* Life Expectancy */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Life Expectancy (Years)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.lifeExpectancy}
                  onChange={(e) =>
                    handleChange("lifeExpectancy", e.target.value)
                  }
                  min={formData.retirementAge + 1}
                  max="100"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[30px]">
                  {formData.lifeExpectancy}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formData.retirementAge + 1}</span>
                <span>100</span>
              </div>
            </div>

            {/* Earning Years Return */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Returns During Earning Years (%)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.earningReturn}
                  onChange={(e) =>
                    handleChange("earningReturn", e.target.value)
                  }
                  min="6"
                  max="18"
                  step="0.5"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[40px]">
                  {formData.earningReturn}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>18%</span>
              </div>
            </div>

            {/* Retirement Years Return */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Returns During Retirement (%)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.retirementReturn}
                  onChange={(e) =>
                    handleChange("retirementReturn", e.target.value)
                  }
                  min="4"
                  max="12"
                  step="0.5"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[40px]">
                  {formData.retirementReturn}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4%</span>
                <span>12%</span>
              </div>
            </div>

            {/* Current Wealth */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Current Retirement Wealth (₹)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  value={formData.currentWealth}
                  onChange={(e) =>
                    handleChange("currentWealth", e.target.value)
                  }
                  min="0"
                  max="50000000"
                  step="100000"
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium min-w-[120px] text-right">
                  ₹{formatInput(formData.currentWealth)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹5,00,00,000</span>
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
              className="bg-white p-6 rounded-xl shadow-md border border-blue-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-blue-200 pb-2 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Your Retirement Plan
              </h2>

              <div className="space-y-6">
                {/* Key Results */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-600 font-medium">
                      Monthly Expense at Retirement
                    </p>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      {formatCurrency(results.monthlyExpenseAtRetirement)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Adjusted for inflation
                    </p>
                  </div>

                  <div className="p-4 bg-blue-100 rounded-lg border border-blue-300">
                    <p className="text-gray-700 font-medium">
                      Retirement Corpus Required
                    </p>
                    <p className="text-blue-700 font-bold text-2xl mt-1">
                      {formatCurrency(results.corpusRequired)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      For {results.retirementYears} years of retirement
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-600 font-medium">
                      Monthly SIP Required
                    </p>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      {formatCurrency(results.monthlySIP)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      For next {results.yearsToRetirement} years
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                  <h3 className="text-lg font-semibold mb-3">
                    Retirement Timeline
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">
                        {results.yearsToRetirement}
                      </p>
                      <p className="text-sm opacity-90">Years to Retire</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {formData.retirementAge}
                      </p>
                      <p className="text-sm opacity-90">Retirement Age</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {results.retirementYears}
                      </p>
                      <p className="text-sm opacity-90">Retirement Years</p>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="p-4 bg-gray-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Corpus Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Current Wealth Future Value:
                      </span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(results.futureValueCurrentWealth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        SIP Contributions Future Value:
                      </span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(results.futureValueSIP)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Corpus Shortfall:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(results.shortfall)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-gray-700 font-semibold">
                        Total Required:
                      </span>
                      <span className="text-blue-700 font-bold">
                        {formatCurrency(results.corpusRequired)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                {chartData && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-500" />
                      Corpus Composition
                    </h3>
                    <div className="max-w-xs mx-auto">
                      <Pie data={chartData} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                        <span>Current Wealth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>SIP Contributions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                        <span>Shortfall</span>
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
              className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex items-center justify-center"
            >
              <div className="text-center">
                <Calculator className="w-12 h-12 mx-auto text-blue-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  Adjust sliders to calculate your retirement corpus
                </h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetirementCorpusCalculator;
