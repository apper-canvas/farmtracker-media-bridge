import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
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

        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;