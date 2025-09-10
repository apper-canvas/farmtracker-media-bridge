import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const FarmGrid = ({ farms, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {farms.map((farm) => (
        <Card key={farm.Id} className="hover:scale-105 transform transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <ApperIcon name="MapPin" size={20} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{farm.name}</CardTitle>
                  <p className="text-sm text-gray-600">{farm.location}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(farm)}
                >
                  <ApperIcon name="Edit" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(farm.Id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Maximize" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Size:</span>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {farm.size} acres
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Created:</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {format(new Date(farm.createdAt), "MMM d, yyyy")}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetails(farm)}
              className="w-full"
            >
              <ApperIcon name="Eye" size={16} className="mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FarmGrid;