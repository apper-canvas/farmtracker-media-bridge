import { toast } from "react-toastify";
import React from "react";

class TaskService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'task_c';
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
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
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
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
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
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch task");
      return null;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
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
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      toast.error("Failed to fetch farm tasks");
      return [];
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Title_c: taskData.title,
          Description_c: taskData.description || "",
          Category_c: taskData.category,
          Priority_c: taskData.priority,
          DueDate_c: taskData.dueDate,
          Completed_c: false,
          FarmId_c: parseInt(taskData.farmId),
          CropId_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
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
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Title_c: taskData.title,
          Description_c: taskData.description || "",
          Category_c: taskData.category,
          Priority_c: taskData.priority,
          DueDate_c: taskData.dueDate,
          Completed_c: taskData.completed !== undefined ? taskData.completed : false,
          FarmId_c: taskData.farmId ? parseInt(taskData.farmId) : null,
          CropId_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
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
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
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
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  }

  async complete(id) {
    try {
      const task = await this.getById(id);
      if (!task) return null;
      
      return await this.update(id, {
        ...task,
        completed: true
      });
    } catch (error) {
      console.error("Error completing task:", error?.response?.data?.message || error);
      toast.error("Failed to complete task");
      return null;
    }
  }

  async getUpcoming(days = 7) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const now = new Date();
      const future = new Date();
      future.setDate(now.getDate() + days);
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
        ],
        where: [
          {"FieldName": "Completed_c", "Operator": "EqualTo", "Values": [false]},
          {"FieldName": "DueDate_c", "Operator": "LessThanOrEqualTo", "Values": [future.toISOString()]}
        ],
        orderBy: [{"fieldName": "DueDate_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch upcoming tasks");
      return [];
    }
  }
}

export const taskService = new TaskService();