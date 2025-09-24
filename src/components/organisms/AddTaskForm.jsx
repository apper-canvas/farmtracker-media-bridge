import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";

const AddTaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "watering"
  });

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (formData.farmId) {
      loadCrops();
    }
  }, [formData.farmId]);

  useEffect(() => {
if (task) {
      setFormData({
        farmId: task.FarmId_c || "",
        cropId: task.CropId_c || "",
        title: task.Title_c || "",
        description: task.Description_c || "",
        dueDate: task.DueDate_c ? task.DueDate_c.split("T")[0] : "",
        priority: task.Priority_c || "medium",
        category: task.Category_c || "watering"
      });
    }
  }, [task]);

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (error) {
      console.error("Failed to load farms:", error);
    }
  };

  const loadCrops = async () => {
    try {
      const allCrops = await cropService.getAll();
const farmCrops = allCrops.filter(crop => crop.FarmId_c === formData.farmId);
      setCrops(farmCrops);
    } catch (error) {
      console.error("Failed to load crops:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        completed: task?.Completed_c || false
      };
      
      await onSubmit(taskData);
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === "farmId" ? { cropId: "" } : {})
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={20} className="text-primary-600" />
          <span>{task ? "Edit Task" : "Add New Task"}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Farm" required>
              <Select
                value={formData.farmId}
                onChange={(e) => handleChange("farmId", e.target.value)}
                required
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
<option key={farm.Id} value={farm.Id}>
                    {farm.Name_c}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Crop" required>
              <Select
                value={formData.cropId}
                onChange={(e) => handleChange("cropId", e.target.value)}
                disabled={!formData.farmId}
                required
              >
                <option value="">Select a crop</option>
{crops.map(crop => (
                  <option key={crop.Id} value={crop.Id}>
                    {crop.Name_c} - {crop.Variety_c}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Task Title" required>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Water tomatoes in greenhouse"
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add any additional details or notes..."
              rows={3}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Due Date" required>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                required
              />
            </FormField>

            <FormField label="Priority" required>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                required
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
            </FormField>

            <FormField label="Category" required>
              <Select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              >
                <option value="watering">Watering</option>
                <option value="harvesting">Harvesting</option>
                <option value="planting">Planting</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="weeding">Weeding</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {task ? "Update Task" : "Create Task"}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTaskForm;