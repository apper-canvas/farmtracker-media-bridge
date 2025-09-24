import { toast } from "react-toastify";

class TransactionService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'transaction_c';
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
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
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
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      toast.error("Failed to fetch transactions");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
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
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch transaction");
      return null;
    }
  }

  async getByFarmId(farmId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
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
      console.error("Error fetching transactions by farm:", error?.response?.data?.message || error);
      toast.error("Failed to fetch farm transactions");
      return [];
    }
  }

  async create(transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const amount = transactionData.type === "expense" ? 
        -Math.abs(parseFloat(transactionData.amount)) : 
        Math.abs(parseFloat(transactionData.amount));
      
      const params = {
        records: [{
          Description_c: transactionData.description,
          Category_c: transactionData.category,
          Type_c: transactionData.type,
          Amount_c: amount,
          Date_c: transactionData.date || new Date().toISOString(),
          FarmId_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to create ${failed.length} transactions:`, JSON.stringify(failed));
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
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      toast.error("Failed to create transaction");
      return null;
    }
  }

  async update(id, transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const amount = transactionData.type === "expense" ? 
        -Math.abs(parseFloat(transactionData.amount)) : 
        Math.abs(parseFloat(transactionData.amount));
      
      const params = {
        records: [{
          Id: parseInt(id),
          Description_c: transactionData.description,
          Category_c: transactionData.category,
          Type_c: transactionData.type,
          Amount_c: amount,
          Date_c: transactionData.date || new Date().toISOString(),
          FarmId_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to update ${failed.length} transactions:`, JSON.stringify(failed));
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
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      toast.error("Failed to update transaction");
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
          console.error(`Failed to delete ${failed.length} transactions:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      toast.error("Failed to delete transaction");
      return false;
    }
  }

  async getSummary() {
    try {
      const transactions = await this.getAll();
      
      const totalIncome = transactions
        .filter(t => t.Type_c === "income")
        .reduce((sum, t) => sum + Math.abs(t.Amount_c), 0);
      
      const totalExpenses = transactions
        .filter(t => t.Type_c === "expense")
        .reduce((sum, t) => sum + Math.abs(t.Amount_c), 0);
      
      return {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        recentTransactions: transactions
          .sort((a, b) => new Date(b.Date_c) - new Date(a.Date_c))
          .slice(0, 5)
      };
    } catch (error) {
      console.error("Error getting transaction summary:", error?.response?.data?.message || error);
      toast.error("Failed to get transaction summary");
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        recentTransactions: []
      };
    }
  }
}

export const transactionService = new TransactionService();
