import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const CropList = ({ crops, onEdit, onDelete, onHarvest }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "planted": return "info";
      case "growing": return "success";
      case "ready": return "warning";
      case "harvested": return "default";
      default: return "default";
    }
  };

  const getCropIcon = (cropName) => {
    const name = cropName.toLowerCase();
    if (name.includes("corn") || name.includes("maize")) return "Wheat";
    if (name.includes("tomato")) return "Apple";
    if (name.includes("wheat")) return "Wheat";
    if (name.includes("rice")) return "Wheat";
    if (name.includes("potato")) return "Apple";
    return "Sprout";
  };

  const getDaysToHarvest = (expectedHarvest) => {
    const days = differenceInDays(new Date(expectedHarvest), new Date());
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <div className="space-y-4">
      {crops.map((crop) => (
        <Card key={crop.Id} className="hover:scale-102 transform transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                    <ApperIcon name={getCropIcon(crop.name)} size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                    <Badge variant={getStatusVariant(crop.status)}>
                      {crop.status}
                    </Badge>
                  </div>
                  
                  {crop.variety && (
                    <p className="text-sm text-gray-600 mb-2">Variety: {crop.variety}</p>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" size={12} />
                      <span>Planted: {format(new Date(crop.plantedDate), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Clock" size={12} />
                      <span>Harvest: {getDaysToHarvest(crop.expectedHarvest)}</span>
                    </div>
                  </div>
                  
                  {crop.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{crop.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {crop.status.toLowerCase() === "ready" && (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => onHarvest(crop.Id)}
                  >
                    <ApperIcon name="Scissors" size={14} className="mr-1" />
                    Harvest
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(crop)}
                >
                  <ApperIcon name="Edit" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(crop.Id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CropList;