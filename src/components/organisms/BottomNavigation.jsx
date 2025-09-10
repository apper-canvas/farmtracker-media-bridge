import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

const navItems = [
    { path: "/", icon: "BarChart3", label: "Dashboard" },
    { path: "/farms", icon: "MapPin", label: "Farms" },
    { path: "/crops", icon: "Sprout", label: "Crops" },
    { path: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { path: "/finances", icon: "DollarSign", label: "Finances" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105" 
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={cn(
                  "mb-1 transition-transform duration-200",
                  isActive ? "scale-110" : ""
                )} 
              />
              <span className={cn(
                "text-xs font-medium leading-tight",
                isActive ? "font-semibold" : ""
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;