import farmsData from "@/services/mockData/farms.json";

class FarmService {
  constructor() {
    this.farms = [...farmsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.farms];
  }

  async getById(id) {
    await this.delay(200);
    const farm = this.farms.find(f => f.Id === parseInt(id));
    if (!farm) throw new Error("Farm not found");
    return { ...farm };
  }

  async create(farmData) {
    await this.delay(400);
    const newId = Math.max(...this.farms.map(f => f.Id)) + 1;
    const newFarm = {
      Id: newId,
      ...farmData,
      createdAt: new Date().toISOString()
    };
    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await this.delay(350);
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Farm not found");
    
    this.farms[index] = {
      ...this.farms[index],
      ...farmData,
      Id: parseInt(id)
    };
    return { ...this.farms[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Farm not found");
    
    const deleted = this.farms.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const farmService = new FarmService();