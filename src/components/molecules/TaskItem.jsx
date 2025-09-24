import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "watering": return "Droplets";
      case "harvesting": return "Wheat";
      case "planting": return "Sprout";
      case "fertilizing": return "Zap";
      case "weeding": return "Trash2";
      case "maintenance": return "Wrench";
      default: return "CheckSquare";
    }
  };

const isOverdue = new Date(task.DueDate_c) < new Date() && !task.Completed_c;
  const isDueSoon = new Date(task.DueDate_c) - new Date() < 24 * 60 * 60 * 1000 && !task.Completed_c;

  return (
<Card className={`transition-all duration-300 ${task.Completed_c ? "opacity-75" : ""} ${isOverdue ? "border-red-300 bg-red-50/50" : isDueSoon ? "border-yellow-300 bg-yellow-50/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
<div className={`p-2 rounded-lg ${task.Completed_c ? "bg-green-100" : "bg-primary-100"}`}>
                <ApperIcon 
                  name={task.Completed_c ? "CheckCircle" : getCategoryIcon(task.Category_c)} 
                  size={16} 
                  className={task.Completed_c ? "text-green-600" : "text-primary-600"}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
<h4 className={`font-semibold ${task.Completed_c ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {task.Title_c}
                </h4>
                <Badge variant={getPriorityVariant(task.Priority_c)} className="ml-2">
                  {task.Priority_c}
                </Badge>
              </div>
{task.Description_c && (
                <p className={`text-sm mb-2 ${task.Completed_c ? "text-gray-400" : "text-gray-600"}`}>
                  {task.Description_c}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={12} className="mr-1" />
{format(new Date(task.DueDate_c), "MMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Tag" size={12} className="mr-1" />
{task.Category_c}
                </div>
                {isOverdue && (
                  <Badge variant="error" className="text-xs">
                    Overdue
                  </Badge>
                )}
                {isDueSoon && !isOverdue && (
                  <Badge variant="warning" className="text-xs">
                    Due Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
{!task.Completed_c && (
              <Button
                size="sm"
                variant="accent"
                onClick={() => onComplete(task.Id)}
              >
                <ApperIcon name="Check" size={14} />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
            >
              <ApperIcon name="Edit" size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.Id)}
              className="text-red-500 hover:text-red-700"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;