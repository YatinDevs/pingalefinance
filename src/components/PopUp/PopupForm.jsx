import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Building, ChevronDown } from "lucide-react";

const services = [
  "NABL Accreditation",
  "BIS Product Certification",
  "BIS Electronic Goods Registration",
  "OTR for Importers",
  "Hallmarking Training & Consultancy",
  "Management System Consultancy",
  "Other Services",
];

function PopupForm({ setIsOpen, isOpen }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    service: "",
  });

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Form container - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              duration: 0.3,
            }}
            className="relative w-full max-w-md mx-2" // Added mx-2 for small screens
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100/50 transition-all z-10"
                aria-label="Close form"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Adjusted padding for mobile */}
              <div className="p-6 sm:p-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
                >
                  Request a Consultation
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm sm:text-base text-gray-500 mb-6"
                >
                  Fill out the form and we'll get back to you shortly
                </motion.p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1"
                  >
                    <label
                      htmlFor="fullName"
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700"
                    >
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all bg-white/80 hover:bg-white/90"
                      required
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-1"
                  >
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700"
                    >
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all bg-white/80 hover:bg-white/90"
                      required
                    />
                  </motion.div>

                  {/* Company */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-1"
                  >
                    <label
                      htmlFor="company"
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700"
                    >
                      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all bg-white/80 hover:bg-white/90"
                    />
                  </motion.div>

                  {/* Service Select */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-1 relative"
                  >
                    <label
                      htmlFor="service"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Select Service Required
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 pr-8 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none bg-white/80 hover:bg-white/90"
                        required
                      >
                        <option value="">Select an option</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <button
                      type="submit"
                      className="w-full text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-2.5 sm:py-3 px-6 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
                    >
                      Submit Request
                    </button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopupForm;
