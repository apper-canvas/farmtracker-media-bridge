import React from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskFilters = ({ filters, onFiltersChange }) => {
  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "watering", label: "Watering" },
    { value: "harvesting", label: "Harvesting" },
    { value: "planting", label: "Planting" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "weeding", label: "Weeding" },
    { value: "maintenance", label: "Maintenance" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      priority: "all",
      category: "all"
    });
  };

  const hasActiveFilters = filters.status !== "all" || filters.priority !== "all" || filters.category !== "all";

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
          
          <div className={cn(
            "px-3 py-1 rounded-lg text-xs font-medium border",
            hasActiveFilters 
              ? "bg-primary-50 text-primary-700 border-primary-200" 
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}>
            <ApperIcon name="Filter" size={12} className="inline mr-1" />
            {hasActiveFilters ? "Filtered" : "All Tasks"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;