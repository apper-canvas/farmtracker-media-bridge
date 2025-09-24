import { toast } from "react-toastify";

class CropService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'crop_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Variety_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "PlantedDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      toast.error("Failed to fetch crops");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Variety_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "PlantedDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch crop");
      return null;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Variety_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "PlantedDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ],
        where: [{"FieldName": "FarmId_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      toast.error("Failed to fetch farm crops");
      return [];
    }
  }

  async create(cropData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name_c: cropData.name,
          Variety_c: cropData.variety || "",
          Status_c: cropData.status,
          PlantedDate_c: cropData.plantedDate,
          ExpectedHarvest_c: cropData.expectedHarvest,
          Notes_c: cropData.notes || "",
          FarmId_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      toast.error("Failed to create crop");
      return null;
    }
  }

  async update(id, cropData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name_c: cropData.name,
          Variety_c: cropData.variety || "",
          Status_c: cropData.status,
          PlantedDate_c: cropData.plantedDate,
          ExpectedHarvest_c: cropData.expectedHarvest,
          Notes_c: cropData.notes || "",
          FarmId_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
      toast.error("Failed to update crop");
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} crops:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      toast.error("Failed to delete crop");
      return false;
    }
  }

  async harvest(id) {
    try {
      const crop = await this.getById(id);
      if (!crop) return null;
      
      return await this.update(id, {
        ...crop,
        status: "Harvested"
      });
    } catch (error) {
      console.error("Error harvesting crop:", error?.response?.data?.message || error);
      toast.error("Failed to harvest crop");
      return null;
    }
  }
}

export const cropService = new CropService();