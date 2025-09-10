import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;