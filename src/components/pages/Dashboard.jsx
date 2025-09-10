import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatsCard from "@/components/molecules/StatsCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskItem from "@/components/molecules/TaskItem";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    recentTransactions: [],
    weather: null,
    summary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [farms, crops, tasks, transactionSummary, weather] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getUpcoming(7),
        transactionService.getSummary(),
        weatherService.getToday()
      ]);

      setData({
        farms,
        crops,
        tasks,
        recentTransactions: transactionSummary.recentTransactions,
        weather,
        summary: transactionSummary
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.complete(taskId);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.Id === taskId ? { ...task, completed: true } : task
        )
      }));
      toast.success("Task completed successfully!");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const activeCrops = data.crops.filter(crop => crop.status !== "Harvested").length;
  const pendingTasks = data.tasks.filter(task => !task.completed).length;
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  return (
    <div className="space-y-8 pb-24">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to your Farm Dashboard</h1>
            <p className="text-primary-100">Track your agricultural operations and make data-driven decisions</p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Tractor" size={48} className="text-primary-200" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Farms"
          value={data.farms.length}
          icon="MapPin"
          gradientFrom="primary-500"
          gradientTo="primary-600"
        />
        <StatsCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          gradientFrom="green-500"
          gradientTo="green-600"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          gradientFrom="accent-400"
          gradientTo="accent-500"
          trend={overdueTasks > 0 ? "down" : "up"}
          trendValue={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
        />
<StatsCard
          title="This Month"
          value={`$${data.summary?.netProfit?.toFixed(0) || 0}`}
          icon="DollarSign"
          gradientFrom={data.summary?.netProfit >= 0 ? "green-500" : "red-500"}
          gradientTo={data.summary?.netProfit >= 0 ? "green-600" : "red-600"}
          trend={data.summary?.netProfit >= 0 ? "up" : "down"}
          trendValue={data.summary?.netProfit >= 0 ? "Profit" : "Loss"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Section */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Today's Weather</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/weather")}
              >
                View Forecast
                <ApperIcon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
            
            {data.weather && (
              <WeatherCard weather={data.weather} isToday={true} />
            )}
            
            <Card className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Farming Tip</span>
                <ApperIcon name="Lightbulb" size={16} className="text-yellow-500" />
              </div>
              <p className="text-sm text-gray-700 mt-2">
                {data.weather?.condition?.toLowerCase().includes("rain") 
                  ? "Great weather for natural irrigation! Consider postponing watering tasks."
                  : "Perfect weather for field work. Check your irrigation systems."}
              </p>
            </Card>
          </div>
        </div>

        {/* Upcoming Tasks & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate("/tasks")}
              >
                <ApperIcon name="Plus" size={16} className="mr-1" />
                Add Task
              </Button>
            </div>

            {data.tasks.length === 0 ? (
              <Empty
                icon="CheckSquare"
                title="No upcoming tasks"
                description="All caught up! Create new tasks to stay organized."
                actionLabel="Add First Task"
                onAction={() => navigate("/tasks")}
              />
            ) : (
              <div className="space-y-3">
                {data.tasks.slice(0, 3).map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onEdit={() => navigate("/tasks")}
                    onDelete={() => {}}
                  />
                ))}
                {data.tasks.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/tasks")}
                    className="w-full"
                  >
                    View All {data.tasks.length} Tasks
                    <ApperIcon name="ArrowRight" size={16} className="ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Recent Financial Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/finances")}
                >
                  View All
                  <ApperIcon name="ArrowRight" size={16} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.recentTransactions.length === 0 ? (
                <Empty
                  icon="DollarSign"
                  title="No transactions yet"
                  description="Start tracking your farm's financial activity."
                  actionLabel="Add Transaction"
                  onAction={() => navigate("/finances")}
                />
              ) : (
                <div className="space-y-3">
                  {data.recentTransactions.slice(0, 3).map((transaction) => {
                    const isIncome = transaction.type === "income";
                    return (
                      <div key={transaction.Id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isIncome ? "bg-green-100" : "bg-red-100"}`}>
                            <ApperIcon
                              name={isIncome ? "TrendingUp" : "TrendingDown"}
                              size={16}
                              className={isIncome ? "text-green-600" : "text-red-600"}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.category}</p>
                          </div>
                        </div>
                        <div className={`font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                          {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <CardTitle className="mb-4">Quick Actions</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
onClick={() => navigate("/farms")}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <ApperIcon name="MapPin" size={24} />
            <span>Add Farm</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/crops")}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <ApperIcon name="Sprout" size={24} />
            <span>View Crops</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/tasks")}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <ApperIcon name="Plus" size={24} />
            <span>New Task</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/finances")}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <ApperIcon name="DollarSign" size={24} />
            <span>Log Expense</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;