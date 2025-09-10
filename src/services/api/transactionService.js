import transactionsData from "@/services/mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.transactions];
  }

  async getById(id) {
    await this.delay(200);
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) throw new Error("Transaction not found");
    return { ...transaction };
  }

  async getByFarmId(farmId) {
    await this.delay(250);
    return this.transactions.filter(t => t.farmId === farmId.toString()).map(t => ({ ...t }));
  }

  async create(transactionData) {
    await this.delay(400);
    const newId = Math.max(...this.transactions.map(t => t.Id)) + 1;
    const newTransaction = {
      Id: newId,
      ...transactionData,
      farmId: transactionData.farmId.toString(),
      amount: transactionData.type === "expense" ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount),
      date: transactionData.date || new Date().toISOString()
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await this.delay(350);
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData,
      Id: parseInt(id),
      farmId: transactionData.farmId?.toString() || this.transactions[index].farmId,
      amount: transactionData.type === "expense" ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount)
    };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
    const deleted = this.transactions.splice(index, 1)[0];
    return { ...deleted };
  }

  async getSummary() {
    await this.delay(300);
    const totalIncome = this.transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalExpenses = this.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      recentTransactions: this.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(t => ({ ...t }))
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const transactionService = new TransactionService();