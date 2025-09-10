import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const getCategoryIcon = (category, type) => {
    if (type === "income") {
      switch (category.toLowerCase()) {
        case "crop sales": return "Wheat";
        case "livestock": return "Beef";
        case "equipment rental": return "Truck";
        case "subsidies": return "Award";
        default: return "DollarSign";
      }
    } else {
      switch (category.toLowerCase()) {
        case "seeds": return "Sprout";
        case "fertilizer": return "Zap";
        case "equipment": return "Wrench";
        case "labor": return "Users";
        case "utilities": return "Lightbulb";
        case "fuel": return "Fuel";
        case "maintenance": return "Settings";
        default: return "Minus";
      }
    }
  };

  const isIncome = transaction.type === "income";

  return (
    <Card className="transition-all duration-300 hover:scale-102">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${isIncome ? "bg-green-100" : "bg-red-100"}`}>
              <ApperIcon 
                name={getCategoryIcon(transaction.category, transaction.type)} 
                size={16} 
                className={isIncome ? "text-green-600" : "text-red-600"} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 truncate">{transaction.description}</p>
                <p className={`font-bold text-lg ${isIncome ? "text-green-600" : "text-red-600"}`}>
                  {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <Badge variant={isIncome ? "success" : "error"} className="text-xs">
                  {transaction.category}
                </Badge>
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={12} className="mr-1" />
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(transaction)}
            >
              <ApperIcon name="Edit" size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(transaction.Id)}
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

export default TransactionItem;