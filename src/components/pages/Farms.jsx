import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import FarmGrid from "@/components/organisms/FarmGrid";
import CropList from "@/components/organisms/CropList";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [editingCrop, setEditingCrop] = useState(null);
  const [showAddCropForm, setShowAddCropForm] = useState(false);

  const [farmForm, setFarmForm] = useState({
    name: "",
    size: "",
    location: ""
  });

  const [cropForm, setCropForm] = useState({
    name: "",
    variety: "",
    plantedDate: "",
    expectedHarvest: "",
    status: "Planted",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      loadCrops();
    }
  }, [selectedFarm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const loadCrops = async () => {
    try {
      const cropsData = await cropService.getByFarmId(selectedFarm.Id);
      setCrops(cropsData);
    } catch (err) {
      toast.error("Failed to load crops");
    }
  };

  const handleSubmitFarm = async (e) => {
    e.preventDefault();
    try {
      const farmData = {
        ...farmForm,
        size: parseFloat(farmForm.size)
      };

      if (editingFarm) {
        const updated = await farmService.update(editingFarm.Id, farmData);
        setFarms(prev => prev.map(f => f.Id === updated.Id ? updated : f));
        toast.success("Farm updated successfully!");
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms(prev => [...prev, newFarm]);
        toast.success("Farm added successfully!");
      }

      resetFarmForm();
    } catch (err) {
      toast.error("Failed to save farm");
    }
  };

  const handleSubmitCrop = async (e) => {
    e.preventDefault();
    try {
      const cropData = {
        ...cropForm,
        farmId: selectedFarm.Id.toString(),
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

      resetCropForm();
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!confirm("Are you sure you want to delete this farm?")) return;
    
    try {
      await farmService.delete(farmId);
      setFarms(prev => prev.filter(f => f.Id !== farmId));
      if (selectedFarm?.Id === farmId) {
        setSelectedFarm(null);
        setCrops([]);
      }
      toast.success("Farm deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete farm");
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;
    
    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(c => c.Id !== cropId));
      toast.success("Crop deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete crop");
    }
  };

  const handleHarvestCrop = async (cropId) => {
    try {
      const updated = await cropService.harvest(cropId);
      setCrops(prev => prev.map(c => c.Id === updated.Id ? updated : c));
      toast.success("Crop harvested successfully!");
    } catch (err) {
      toast.error("Failed to harvest crop");
    }
  };

  const resetFarmForm = () => {
    setFarmForm({ name: "", size: "", location: "" });
    setShowAddForm(false);
    setEditingFarm(null);
  };

  const resetCropForm = () => {
    setCropForm({
      name: "",
      variety: "",
      plantedDate: "",
      expectedHarvest: "",
      status: "Planted",
      notes: ""
    });
    setShowAddCropForm(false);
    setEditingCrop(null);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setFarmForm({
      name: farm.name,
      size: farm.size.toString(),
      location: farm.location
    });
    setShowAddForm(true);
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setCropForm({
      name: crop.name,
      variety: crop.variety,
      plantedDate: crop.plantedDate.split("T")[0],
      expectedHarvest: crop.expectedHarvest.split("T")[0],
      status: crop.status,
      notes: crop.notes || ""
    });
    setShowAddCropForm(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8 pb-24">
      {!selectedFarm ? (
        <>
          {/* Farms Overview */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Farms</h1>
              <p className="text-gray-600">Manage your farm properties and crop production</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Farm
            </Button>
          </div>

          {/* Add Farm Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingFarm ? "Edit Farm" : "Add New Farm"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFarm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Farm Name" required>
                      <Input
                        value={farmForm.name}
                        onChange={(e) => setFarmForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Green Valley Farm"
                        required
                      />
                    </FormField>

                    <FormField label="Size (acres)" required>
                      <Input
                        type="number"
                        value={farmForm.size}
                        onChange={(e) => setFarmForm(prev => ({ ...prev, size: e.target.value }))}
                        placeholder="e.g., 150"
                        min="0"
                        step="0.1"
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Location" required>
                    <Input
                      value={farmForm.location}
                      onChange={(e) => setFarmForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., California, USA"
                      required
                    />
                  </FormField>

                  <div className="flex items-center space-x-3">
                    <Button type="submit" variant="primary">
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {editingFarm ? "Update Farm" : "Add Farm"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetFarmForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Farms Grid */}
          {farms.length === 0 ? (
            <Empty
              icon="MapPin"
              title="No farms yet"
              description="Start by adding your first farm to begin tracking your agricultural operations."
              actionLabel="Add First Farm"
              onAction={() => setShowAddForm(true)}
            />
          ) : (
            <FarmGrid
              farms={farms}
              onEdit={handleEditFarm}
              onDelete={handleDeleteFarm}
              onViewDetails={setSelectedFarm}
            />
          )}
        </>
      ) : (
        <>
          {/* Farm Details View */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFarm(null);
                  setCrops([]);
                }}
              >
                <ApperIcon name="ArrowLeft" size={16} className="mr-1" />
                Back to Farms
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedFarm.name}</h1>
                <p className="text-gray-600">{selectedFarm.location} • {selectedFarm.size} acres</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddCropForm(true)}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Crop
            </Button>
          </div>

          {/* Add Crop Form */}
          {showAddCropForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitCrop} className="space-y-4">
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
                      <select
                        value={cropForm.status}
                        onChange={(e) => setCropForm(prev => ({ ...prev, status: e.target.value }))}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white/95 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="Planted">Planted</option>
                        <option value="Growing">Growing</option>
                        <option value="Ready">Ready</option>
                        <option value="Harvested">Harvested</option>
                      </select>
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
                    <Button type="button" variant="outline" onClick={resetCropForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Crops List */}
          {crops.length === 0 ? (
            <Empty
              icon="Sprout"
              title="No crops planted"
              description="Add your first crop to start tracking your planting and harvest schedule."
              actionLabel="Add First Crop"
              onAction={() => setShowAddCropForm(true)}
            />
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Planted Crops</h2>
              <CropList
                crops={crops}
                onEdit={handleEditCrop}
                onDelete={handleDeleteCrop}
                onHarvest={handleHarvestCrop}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Farms;