import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Finances from "@/components/pages/Finances";
import Weather from "@/components/pages/Weather";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/finances" element={<Finances />} />
<Route path="/crops" element={<Crops />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>
        </main>

        <BottomNavigation />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;