import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import TransactionItem from "@/components/molecules/TransactionItem";
import StatsCard from "@/components/molecules/StatsCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const Finances = () => {
const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [transactionForm, setTransactionForm] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: ""
  });

  const expenseCategories = [
    "Seeds", "Fertilizer", "Equipment", "Labor", "Utilities", "Fuel", "Maintenance", "Other"
  ];

  const incomeCategories = [
    "Crop Sales", "Livestock", "Equipment Rental", "Subsidies", "Other"
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0];
    setTransactionForm(prev => ({ ...prev, date: today }));
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, farmsData, summaryData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll(),
        transactionService.getSummary()
      ]);
      
      setTransactions(transactionsData);
      setFarms(farmsData);
      setSummary(summaryData);
    } catch (err) {
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
        date: new Date(transactionForm.date).toISOString()
      };

      if (editingTransaction) {
        const updated = await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prev => prev.map(t => t.Id === updated.Id ? updated : t));
        toast.success("Transaction updated successfully!");
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
        toast.success("Transaction added successfully!");
      }

      // Refresh summary
      const summaryData = await transactionService.getSummary();
      setSummary(summaryData);

      resetForm();
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await transactionService.delete(transactionId);
      setTransactions(prev => prev.filter(t => t.Id !== transactionId));
      
      // Refresh summary
      const summaryData = await transactionService.getSummary();
      setSummary(summaryData);
      
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      farmId: transaction.farmId,
      type: transaction.type,
      category: transaction.category,
      amount: Math.abs(transaction.amount).toString(),
      description: transaction.description,
      date: transaction.date.split("T")[0]
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setTransactionForm({
      farmId: "",
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: today
    });
    setShowAddForm(false);
    setEditingTransaction(null);
  };

const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    return filtered;
  };

  const getAllCategories = () => {
    const categories = new Set();
    transactions.forEach(t => {
      if (t.category) categories.add(t.category);
    });
    return Array.from(categories).sort();
  };

  const getCurrentCategories = () => {
    return transactionForm.type === "income" ? incomeCategories : expenseCategories;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

const filteredTransactions = useMemo(() => {
    const filtered = getFilteredTransactions();
    
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "amount":
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case "category":
          aValue = a.category?.toLowerCase() || "";
          bValue = b.category?.toLowerCase() || "";
          break;
        case "description":
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [transactions, filterType, filterCategory, sortBy, sortOrder]);

  return (
    <div className="space-y-8 pb-24">
      {!showAddForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Finances</h1>
              <p className="text-gray-600">Track your income and expenses to maximize profitability</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Financial Summary */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Income"
                value={`$${summary.totalIncome.toFixed(2)}`}
                icon="TrendingUp"
                gradientFrom="green-500"
                gradientTo="green-600"
              />
              <StatsCard
                title="Total Expenses"
                value={`$${summary.totalExpenses.toFixed(2)}`}
                icon="TrendingDown"
                gradientFrom="red-500"
                gradientTo="red-600"
              />
              <StatsCard
                title="Net Profit"
                value={`$${summary.netProfit.toFixed(2)}`}
                icon="DollarSign"
                gradientFrom={summary.netProfit >= 0 ? "green-500" : "red-500"}
                gradientTo={summary.netProfit >= 0 ? "green-600" : "red-600"}
                trend={summary.netProfit >= 0 ? "up" : "down"}
                trendValue={summary.netProfit >= 0 ? "Profitable" : "Loss"}
              />
            </div>
          )}

{/* Filters and Sort Controls */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-lg space-y-4">
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { value: "all", label: "All Transactions", icon: "List" },
                { value: "income", label: "Income", icon: "TrendingUp" },
                { value: "expense", label: "Expenses", icon: "TrendingDown" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setFilterType(tab.value);
                    setFilterCategory("all"); // Reset category filter when changing type
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filterType === tab.value
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Category and Sort Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {getAllCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sort by</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                  <option value="description">Description</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="flex-1 justify-center"
                  >
                    <ApperIcon 
                      name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                      size={14} 
                      className="mr-1"
                    />
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(filterType !== "all" || filterCategory !== "all") && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterType("all");
                    setFilterCategory("all");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={14} className="mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <Empty
              icon="DollarSign"
              title="No transactions recorded"
              description="Start tracking your farm's financial activity by adding your first transaction."
              actionLabel="Add First Transaction"
              onAction={() => setShowAddForm(true)}
            />
          ) : filteredTransactions.length === 0 ? (
            <Empty
              icon="Filter"
              title={`No ${filterType} transactions`}
              description="Try switching to a different filter to see more transactions."
              actionLabel="View All Transactions"
              onAction={() => setFilterType("all")}
            />
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.Id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTransaction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Farm" required>
                  <Select
                    value={transactionForm.farmId}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, farmId: e.target.value }))}
                    required
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>
                        {farm.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Type" required>
                  <Select
                    value={transactionForm.type}
                    onChange={(e) => setTransactionForm(prev => ({ 
                      ...prev, 
                      type: e.target.value,
                      category: "" // Reset category when type changes
                    }))}
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <Select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select a category</option>
                    {getCurrentCategories().map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Amount" required>
                  <Input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Date" required>
                <Input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </FormField>

              <FormField label="Description" required>
                <Input
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Corn seeds for north field"
                  required
                />
              </FormField>

              <div className="flex items-center space-x-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {editingTransaction ? "Update Transaction" : "Add Transaction"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Finances;