import React from "react";
import LoadCalculator from "./Components/LoadCalculator";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6">
        <LoadCalculator />
      </div>
    </main>
  );
}

export default App;
