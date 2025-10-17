import React from "react";
import SIPCalculator from "../Calculators/SIPCalculator";
import SipSwpCalculator from "../Calculators/SipSwpCalculator";
import FutureWealthCalculator from "../Calculators/FutureWealthCalculator";
import RetirementCorpusCalculator from "../Calculators/RetirementCorpusCalculator";

function Home() {
  return (
    <div className="flex flex-col gap-20 p-30">
      <FutureWealthCalculator />
      <RetirementCorpusCalculator />
      <SIPCalculator />
      <SipSwpCalculator />
    </div>
  );
}

export default Home;
