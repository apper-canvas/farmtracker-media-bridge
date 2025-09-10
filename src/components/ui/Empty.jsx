import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item", 
  onAction,
  className 
}) => {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
          <ApperIcon name={icon} size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
        {onAction && (
          <Button variant="primary" onClick={onAction}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;