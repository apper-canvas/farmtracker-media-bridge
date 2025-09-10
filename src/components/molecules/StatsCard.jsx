import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ title, value, icon, trend, trendValue, className, gradientFrom = "primary-500", gradientTo = "primary-600" }) => {
  const getTrendColor = () => {
    if (!trend) return "";
    return trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={cn("hover:scale-105 transform transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className={`text-2xl font-bold bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent`}>
                {value}
              </p>
              {trendValue && (
                <div className={cn("flex items-center text-xs font-medium", getTrendColor())}>
                  <ApperIcon name={getTrendIcon()} size={12} className="mr-1" />
                  {trendValue}
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${gradientFrom} to-${gradientTo} shadow-lg`}>
            <ApperIcon name={icon} size={20} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;