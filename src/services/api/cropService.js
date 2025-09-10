import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.crops];
  }

  async getById(id) {
    await this.delay(200);
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) throw new Error("Crop not found");
    return { ...crop };
  }

  async getByFarmId(farmId) {
    await this.delay(250);
    return this.crops.filter(c => c.farmId === farmId.toString()).map(c => ({ ...c }));
  }

  async create(cropData) {
    await this.delay(400);
    const newId = Math.max(...this.crops.map(c => c.Id)) + 1;
    const newCrop = {
      Id: newId,
      ...cropData,
      farmId: cropData.farmId.toString()
    };
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await this.delay(350);
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Crop not found");
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id),
      farmId: cropData.farmId?.toString() || this.crops[index].farmId
    };
    return { ...this.crops[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Crop not found");
    
    const deleted = this.crops.splice(index, 1)[0];
    return { ...deleted };
  }

  async harvest(id) {
    await this.delay(300);
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Crop not found");
    
    this.crops[index].status = "Harvested";
    return { ...this.crops[index] };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const cropService = new CropService();