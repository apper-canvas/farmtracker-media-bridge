import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const CropList = ({ crops, onEdit, onDelete, onHarvest }) => {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
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

  const sortedCrops = useMemo(() => {
    const sorted = [...crops].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
case "name":
          aValue = a.Name_c.toLowerCase();
          bValue = b.Name_c.toLowerCase();
          break;
        case "status":
          aValue = a.Status_c.toLowerCase();
          bValue = b.Status_c.toLowerCase();
          break;
        case "plantedDate":
          aValue = new Date(a.PlantedDate_c);
          bValue = new Date(b.PlantedDate_c);
          break;
        case "expectedHarvest":
          aValue = new Date(a.ExpectedHarvest_c);
          bValue = new Date(b.ExpectedHarvest_c);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [crops, sortBy, sortOrder]);

  return (
<div className="space-y-4">
      {/* Sort Controls */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="ArrowUpDown" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-w-[140px]"
            >
              <option value="name">Crop Name</option>
              <option value="status">Status</option>
              <option value="plantedDate">Planted Date</option>
              <option value="expectedHarvest">Harvest Date</option>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="flex items-center space-x-1"
            >
              <ApperIcon 
                name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                size={14} 
              />
              <span className="text-xs">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Crops List */}
      {sortedCrops.map((crop) => (
        <Card key={crop.Id} className="hover:scale-102 transform transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
<ApperIcon name={getCropIcon(crop.Name_c)} size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
<h4 className="font-semibold text-gray-900">{crop.Name_c}</h4>
                    <Badge variant={getStatusVariant(crop.Status_c)}>
                      {crop.Status_c}
                    </Badge>
                  </div>
                  
{crop.Variety_c && (
                    <p className="text-sm text-gray-600 mb-2">Variety: {crop.Variety_c}</p>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" size={12} />
<span>Planted: {format(new Date(crop.PlantedDate_c), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Clock" size={12} />
<span>Harvest: {getDaysToHarvest(crop.ExpectedHarvest_c)}</span>
                    </div>
                  </div>
                  
                  {crop.notes && (
<p className="text-sm text-gray-600 mt-2 italic">{crop.Notes_c}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
{crop.Status_c.toLowerCase() === "ready" && (
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