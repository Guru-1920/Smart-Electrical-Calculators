import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-4">Welcome to PowerTools</h1>
    <p className="mb-6">A hub of smart tools for energy analysis, design, and cost-saving.</p>
    <Link
      to="/tools/smart-load-calculator"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
    >
      🔍 Try the Smart Load Calculator
    </Link>
  </div>
);

export default Home;
