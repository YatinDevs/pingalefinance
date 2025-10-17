import { motion } from "framer-motion";
import { Briefcase, ArrowRight, ChevronsRight, BarChart2 } from "lucide-react";
import { PingaleLogo } from "../assets";

const SujiLogo = () => {
  return (
    <motion.div
      className="flex items-center "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <img
          src={PingaleLogo}
          alt="Pingale Logo"
          className="w-32 h-24 md:w-56 md:h-42"
        />
      </motion.div>
    </motion.div>
  );
};

export default SujiLogo;
