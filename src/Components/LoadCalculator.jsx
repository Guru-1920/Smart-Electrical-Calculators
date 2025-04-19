import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const applianceOptions = [
  "Fridge",
  "TV",
  "Washing Machine",
  "Microwave",
  "AC",
  "Heater",
  "Computer",
  "Fan",
  "Lights",
  "Oven",
  "Dishwasher",
];

const LoadCalculator = () => {
  const [appliance, setAppliance] = useState("");
  const [wattage, setWattage] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [costPerKWh, setCostPerKWh] = useState(0.2); // default cost
  const [appliances, setAppliances] = useState(() => {
    const stored = localStorage.getItem("appliances");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("appliances", JSON.stringify(appliances));
  }, [appliances]);

  const handleCalculate = () => {
    if (!appliance || !wattage || !hoursPerDay) return;
    const watt = parseFloat(wattage);
    const hours = parseFloat(hoursPerDay);

    const energyKWh = (watt * hours) / 1000;
    const cost = energyKWh * parseFloat(costPerKWh);

    const existing = appliances.find((item) => item.appliance === appliance);

    if (existing) {
      const updated = appliances.map((item) =>
        item.appliance === appliance
          ? {
              ...item,
              wattage: item.wattage + watt,
              hoursPerDay: item.hoursPerDay + hours,
              energyKWh: item.energyKWh + energyKWh,
              cost: item.cost + cost,
            }
          : item
      );
      setAppliances(updated);
    } else {
      setAppliances([
        ...appliances,
        { appliance, wattage, hoursPerDay, energyKWh, cost },
      ]);
    }

    setAppliance("");
    setWattage("");
    setHoursPerDay("");
  };

  const handleReset = () => {
    setAppliances([]);
    localStorage.removeItem("appliances");
  };

  const handleExport = () => {
    const csv = [
      ["Appliance", "Wattage", "Hours/Day", "Energy (kWh)", "Cost ($)"],
      ...appliances.map((a) => [
        a.appliance,
        a.wattage,
        a.hoursPerDay,
        a.energyKWh ? a.energyKWh.toFixed(2) : "0.00",
        a.cost ? a.cost.toFixed(2) : "0.00",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "energy_data.csv");
  };

  const totalCost = appliances.reduce(
    (sum, a) => sum + (a.cost ? a.cost : 0),
    0
  );

  const barData = {
    labels: appliances.map((a) => a.appliance),
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: appliances.map((a) => a.energyKWh),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">
        Smart Load Calculator
      </h1>

      {/* Form Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-gray-600">Appliance</label>
          <select
            className="w-full border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={appliance}
            onChange={(e) => setAppliance(e.target.value)}
          >
            <option value="">Select appliance</option>
            {applianceOptions.map((a, index) => (
              <option key={index} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Wattage (W)</label>
          <input
            type="number"
            className="w-full border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={wattage}
            onChange={(e) => setWattage(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Hours/Day</label>
          <input
            type="number"
            className="w-full border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Cost per kWh ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={costPerKWh}
            onChange={(e) => setCostPerKWh(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={handleCalculate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Calculate
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          Reset All
        </button>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
        >
          Export Data
        </button>
      </div>

      {/* Appliance Data Table */}
      {appliances.length > 0 && (
        <>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Appliance</th>
                  <th className="p-2 border">Wattage</th>
                  <th className="p-2 border">Hours/Day</th>
                  <th className="p-2 border">Energy (kWh)</th>
                  <th className="p-2 border">Cost ($)</th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((a, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{a.appliance}</td>
                    <td className="p-2 border">{a.wattage}</td>
                    <td className="p-2 border">{a.hoursPerDay}</td>
                    <td className="p-2 border">
                      {a.energyKWh ? a.energyKWh.toFixed(2) : "0.00"}
                    </td>
                    <td className="p-2 border">
                      {a.cost ? a.cost.toFixed(2) : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center font-semibold mb-6">
            Total Estimated Cost: ${totalCost.toFixed(2)}
          </div>

          {/* Bar Chart Section */}
          <div className="flex justify-center items-center mb-8">
            <div className="w-full max-w-xl">
              <Bar data={barData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadCalculator;
