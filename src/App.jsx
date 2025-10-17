import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import PageNotFound from "./pages/ErrorPages/NotFound";
import Calculators from "./pages/Calculators/Calculators";
import SIPCalculator from "./pages/Calculators/SIPCalculator";
import FutureWealthCalculator from "./pages/Calculators/FutureWealthCalculator";
import RetirementCorpusCalculator from "./pages/Calculators/RetirementCorpusCalculator";
import SipSwpCalculator from "./pages/Calculators/SipSwpCalculator";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calculators" element={<Calculators />} />
        <Route path="calculators/sip" element={<SipSwpCalculator />} />
        <Route
          path="calculators/future-wealth"
          element={<FutureWealthCalculator />}
        />
        <Route
          path="calculators/retire-wealth"
          element={<RetirementCorpusCalculator />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
