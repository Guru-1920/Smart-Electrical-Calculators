import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-700 text-white p-4 shadow-md">
    <div className="flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">⚡ PowerTools</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/tools/smart-load-calculator" className="hover:underline">Smart Load Calculator</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
