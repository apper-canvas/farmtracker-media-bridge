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

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = new Date(task.dueDate) - new Date() < 24 * 60 * 60 * 1000 && !task.completed;

  return (
    <Card className={`transition-all duration-300 ${task.completed ? "opacity-75" : ""} ${isOverdue ? "border-red-300 bg-red-50/50" : isDueSoon ? "border-yellow-300 bg-yellow-50/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              <div className={`p-2 rounded-lg ${task.completed ? "bg-green-100" : "bg-primary-100"}`}>
                <ApperIcon 
                  name={task.completed ? "CheckCircle" : getCategoryIcon(task.category)} 
                  size={16} 
                  className={task.completed ? "text-green-600" : "text-primary-600"} 
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {task.title}
                </h4>
                <Badge variant={getPriorityVariant(task.priority)} className="ml-2">
                  {task.priority}
                </Badge>
              </div>
              {task.description && (
                <p className={`text-sm mb-2 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={12} className="mr-1" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Tag" size={12} className="mr-1" />
                  {task.category}
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
            {!task.completed && (
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