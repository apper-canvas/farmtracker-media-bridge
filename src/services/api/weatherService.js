import { toast } from "react-toastify";

class WeatherService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'weather_c';
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

  async getCurrent() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Condition_c"}},
          {"field": {"Name": "Temperature_c"}},
          {"field": {"Name": "Humidity_c"}},
          {"field": {"Name": "WindSpeed_c"}},
          {"field": {"Name": "Precipitation_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      toast.error("Failed to fetch current weather");
      return null;
    }
  }

  async getForecast(days = 4) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Condition_c"}},
          {"field": {"Name": "Temperature_c"}},
          {"field": {"Name": "Humidity_c"}},
          {"field": {"Name": "WindSpeed_c"}},
          {"field": {"Name": "Precipitation_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": days, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.response?.data?.message || error);
      toast.error("Failed to fetch weather forecast");
      return [];
    }
  }

  async getToday() {
    try {
      return await this.getCurrent();
    } catch (error) {
      console.error("Error fetching today's weather:", error?.response?.data?.message || error);
      toast.error("Failed to fetch today's weather");
      return null;
    }
  }
}

export const weatherService = new WeatherService();