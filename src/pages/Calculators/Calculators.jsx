import { motion } from "framer-motion";
import { useState } from "react";
import {
  CAGRIcon,
  FDIcon,
  InflationIcon,
  PPFIcon,
  SIPIcon,
  SWPIcon,
  TaxIcon,
} from "../../assets";
import { useNavigate } from "react-router-dom";

const CalculatorCard = ({
  icon,
  title,
  description,
  isHovered,
  onHover,
  link,
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => {
        navigate(link); // Remove the backticks and forward slash
      }}
      className={`p-6 rounded-lg shadow-md bg-white cursor-pointer transition-all duration-300 border-2 ${
        isHovered ? "border-green-100" : "border-transparent"
      }`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={onHover}
      onHoverEnd={onHover}
    >
      <div className="flex items-center mb-4">
        <motion.img
          src={icon}
          alt={title}
          className="w-12 h-12 mr-4"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Calculators = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const calculators = [
    {
      id: "future-wealth",
      title: "Future Wealth",
      description:
        "Calculate your potential future wealth based on current investments and regular contributions.",
      icon: SIPIcon, // You'll need to create/add this icon
      link: "future-wealth",
    },
    {
      id: "sip",
      title: "SIP",
      description:
        "Plan your SIP amount based on your investment horizon and estimate return using the SIP calculator below.",
      icon: SIPIcon,
      link: "sip", // Updated path
    },
    {
      id: "swp",
      title: "SWP",
      description:
        "Determine monthly income from the Systematic Withdrawal Plan with mutual fund schemes.",
      icon: SWPIcon,
      link: "swp", // Updated path
    },
    {
      id: "ppf",
      title: "PPF",
      description:
        "Estimate the interest and the maturity amount of your PPF account for the given horizon and rate of interest.",
      icon: PPFIcon,
      link: "ppf", // Updated path
    },
    {
      id: "fd",
      title: "FD",
      description:
        "Calculate fixed deposit interest rates and maturity amounts based on tenure.",
      icon: FDIcon,
      link: "fd", // Updated path
    },
    {
      id: "cagr",
      title: "CAGR",
      description:
        "Calculate the average annual growth of your investment over a given period.",
      icon: CAGRIcon,
      link: "cagr", // Updated path
    },
    {
      id: "inflation",
      title: "Inflation",
      description:
        "Calculate true value of your money with inflation rate and estimate the potential return on your investment.",
      icon: InflationIcon,
      link: "inflation", // Updated path
    },
    {
      id: "tax",
      title: "Income Tax",
      description:
        "Calculate tax on your income or salary for the current financial year.",
      icon: TaxIcon,
      link: "tax", // Updated path
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-semibold text-gray-800">Calculators</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {calculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              icon={calc.icon}
              title={calc.title}
              link={calc.link}
              description={calc.description}
              isHovered={hoveredCard === calc.id}
              onHover={() =>
                setHoveredCard(hoveredCard === calc.id ? null : calc.id)
              }
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Calculators;
