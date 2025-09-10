import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard";
      case "/farms": return "Farms";
      case "/tasks": return "Tasks";
      case "/finances": return "Finances";
      case "/weather": return "Weather";
      default: return "FarmTracker";
    }
  };

  const getPageIcon = () => {
    switch (location.pathname) {
      case "/": return "BarChart3";
      case "/farms": return "MapPin";
      case "/tasks": return "CheckSquare";
      case "/finances": return "DollarSign";
      case "/weather": return "Cloud";
      default: return "Leaf";
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <ApperIcon name="Leaf" size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  FarmTracker
                </h1>
                <p className="text-xs text-gray-500">Agriculture Management</p>
              </div>
            </div>
            
            {/* Current Page Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary-50 border border-primary-200">
              <ApperIcon name={getPageIcon()} size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">{getPageTitle()}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks")}
              className="hidden sm:flex"
            >
              <ApperIcon name="Plus" size={16} className="mr-1" />
              Quick Task
            </Button>
            
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate("/finances")}
              className="hidden sm:flex"
            >
              <ApperIcon name="DollarSign" size={16} className="mr-1" />
              Add Expense
            </Button>

            {/* Mobile menu button - if needed in future */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;