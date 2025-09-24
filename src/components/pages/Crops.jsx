import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { differenceInDays, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Farms from "@/components/pages/Farms";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  const [cropForm, setCropForm] = useState({
    name: "",
    variety: "",
    plantedDate: "",
    expectedHarvest: "",
    status: "Planted",
    farmId: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load data");
      toast.error("Failed to load crops data");
    } finally {
      setLoading(false);
    }
  };

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

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id.toString() === farmId.toString());
    return farm ? farm.name : "Unknown Farm";
  };

  const filteredAndSortedCrops = React.useMemo(() => {
let filtered = crops.filter(crop => {
      const matchesSearch = crop.Name_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (crop.Variety_c && crop.Variety_c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || crop.Status_c.toLowerCase() === statusFilter.toLowerCase();
      const matchesFarm = farmFilter === "all" || crop.FarmId_c === farmFilter;
      
      return matchesSearch && matchesStatus && matchesFarm;
    });

    filtered.sort((a, b) => {
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
        case "farm":
          aValue = getFarmName(a.FarmId_c).toLowerCase();
          bValue = getFarmName(b.FarmId_c).toLowerCase();
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

    return filtered;
  }, [crops, searchTerm, statusFilter, farmFilter, sortBy, sortOrder, farms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cropData = {
        ...cropForm,
        farmId: cropForm.farmId.toString(),
        plantedDate: new Date(cropForm.plantedDate).toISOString(),
        expectedHarvest: new Date(cropForm.expectedHarvest).toISOString()
      };

      if (editingCrop) {
        const updated = await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(c => c.Id === updated.Id ? updated : c));
        toast.success("Crop updated successfully!");
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops(prev => [...prev, newCrop]);
        toast.success("Crop added successfully!");
      }

      resetForm();
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setCropForm({
name: crop.Name_c,
      variety: crop.Variety_c || "",
      plantedDate: crop.PlantedDate_c.split("T")[0],
      expectedHarvest: crop.ExpectedHarvest_c.split("T")[0],
      status: crop.Status_c,
      farmId: crop.FarmId_c,
      notes: crop.Notes_c || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (cropId) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;
    
    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(c => c.Id !== cropId));
      toast.success("Crop deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete crop");
    }
  };

  const handleHarvest = async (cropId) => {
    try {
      const updated = await cropService.harvest(cropId);
      setCrops(prev => prev.map(c => c.Id === updated.Id ? updated : c));
      toast.success("Crop harvested successfully!");
    } catch (err) {
      toast.error("Failed to harvest crop");
    }
  };

  const resetForm = () => {
    setCropForm({
      name: "",
      variety: "",
      plantedDate: "",
      expectedHarvest: "",
      status: "Planted",
      farmId: "",
      notes: ""
    });
    setShowAddForm(false);
    setEditingCrop(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 p-4 pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Crops</h1>
          <p className="text-gray-600">Manage crops across all your farms</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Crop Name" required>
                  <Input
                    value={cropForm.name}
                    onChange={(e) => setCropForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Corn, Tomatoes, Wheat"
                    required
                  />
                </FormField>

                <FormField label="Variety">
                  <Input
                    value={cropForm.variety}
                    onChange={(e) => setCropForm(prev => ({ ...prev, variety: e.target.value }))}
                    placeholder="e.g., Sweet Corn, Roma"
                  />
                </FormField>
              </div>

              <FormField label="Farm" required>
                <Select
                  value={cropForm.farmId}
                  onChange={(e) => setCropForm(prev => ({ ...prev, farmId: e.target.value }))}
                  required
                >
                  <option value="">Select a farm</option>
                  {farms.map(farm => (
<option key={farm.Id} value={farm.Id}>{farm.Name_c}</option>
                  ))}
                </Select>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Planted Date" required>
                  <Input
                    type="date"
                    value={cropForm.plantedDate}
                    onChange={(e) => setCropForm(prev => ({ ...prev, plantedDate: e.target.value }))}
                    required
                  />
                </FormField>

                <FormField label="Expected Harvest" required>
                  <Input
                    type="date"
                    value={cropForm.expectedHarvest}
                    onChange={(e) => setCropForm(prev => ({ ...prev, expectedHarvest: e.target.value }))}
                    required
                  />
                </FormField>

                <FormField label="Status" required>
                  <Select
                    value={cropForm.status}
                    onChange={(e) => setCropForm(prev => ({ ...prev, status: e.target.value }))}
                    required
                  >
                    <option value="Planted">Planted</option>
                    <option value="Growing">Growing</option>
                    <option value="Ready">Ready</option>
                    <option value="Harvested">Harvested</option>
                  </Select>
                </FormField>
              </div>

              <FormField label="Notes">
                <textarea
                  value={cropForm.notes}
                  onChange={(e) => setCropForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or observations..."
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white/95 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </FormField>

              <div className="flex items-center space-x-3">
                <Button type="submit" variant="primary">
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {editingCrop ? "Update Crop" : "Add Crop"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField label="Search">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops..."
                icon={<ApperIcon name="Search" size={16} />}
              />
            </FormField>

            <FormField label="Status Filter">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </Select>
            </FormField>

            <FormField label="Farm Filter">
              <Select
                value={farmFilter}
                onChange={(e) => setFarmFilter(e.target.value)}
              >
                <option value="all">All Farms</option>
                {farms.map(farm => (
<option key={farm.Id} value={farm.Id}>{farm.Name_c}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Sort By">
              <div className="flex space-x-2">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1"
                >
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="farm">Farm</option>
                  <option value="plantedDate">Planted</option>
                  <option value="expectedHarvest">Harvest</option>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                >
                  <ApperIcon 
                    name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                    size={16} 
                  />
                </Button>
              </div>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Crops List */}
      {filteredAndSortedCrops.length === 0 ? (
        <Empty
          icon="Sprout"
          title={crops.length === 0 ? "No crops planted" : "No crops found"}
          description={
            crops.length === 0 
              ? "Add your first crop to start tracking your planting and harvest schedule."
              : "Try adjusting your search or filter criteria."
          }
          actionLabel={crops.length === 0 ? "Add First Crop" : "Clear Filters"}
          onAction={crops.length === 0 ? () => setShowAddForm(true) : () => {
            setSearchTerm("");
            setStatusFilter("all");
            setFarmFilter("all");
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedCrops.length} of {crops.length} crops
            </p>
          </div>

{filteredAndSortedCrops.map((crop) => (
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
                        <h3 className="font-semibold text-gray-900">{crop.Name_c}</h3>
                        <Badge variant={getStatusVariant(crop.Status_c)}>
                          {crop.Status_c}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        {crop.Variety_c && (
                          <p className="text-sm text-gray-600">Variety: {crop.Variety_c}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          <ApperIcon name="MapPin" size={12} className="inline mr-1" />
                          Farm: {getFarmName(crop.FarmId_c)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" size={12} />
                          <span>Planted: {format(new Date(crop.PlantedDate_c), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={12} />
                          <span>Harvest: {getDaysToHarvest(crop.ExpectedHarvest_c)}</span>
                        </div>
                      </div>
                      
                      {crop.Notes_c && (
                        <p className="text-sm text-gray-600 mt-2 italic">{crop.Notes_c}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {crop.Status_c.toLowerCase() === "ready" && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handleHarvest(crop.Id)}
                      >
                        <ApperIcon name="Scissors" size={14} className="mr-1" />
                        Harvest
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(crop)}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(crop.Id)}
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
      )}
    </div>
  );
};

export default Crops;