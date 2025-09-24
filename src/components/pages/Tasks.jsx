import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskItem from "@/components/molecules/TaskItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import TaskFilters from "@/components/organisms/TaskFilters";
import AddTaskForm from "@/components/organisms/AddTaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all"
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Status filter
if (filters.status !== "all") {
      if (filters.status === "pending") {
        filtered = filtered.filter(task => !task.Completed_c);
      } else if (filters.status === "completed") {
        filtered = filtered.filter(task => task.Completed_c);
      } else if (filters.status === "overdue") {
        filtered = filtered.filter(task => 
          !task.Completed_c && new Date(task.DueDate_c) < new Date()
        );
      }
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(task => 
        task.Priority_c?.toLowerCase() === filters.priority
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(task => 
        task.Category_c?.toLowerCase() === filters.category
      );
    }

    // Sort by due date and priority
    filtered.sort((a, b) => {
// Completed tasks go to bottom
      if (a.Completed_c !== b.Completed_c) {
        return a.Completed_c ? 1 : -1;
      }
      
      // Sort by due date
      const dateA = new Date(a.DueDate_c);
      const dateB = new Date(b.DueDate_c);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      
// Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.Priority_c?.toLowerCase()] - priorityOrder[b.Priority_c?.toLowerCase()];
    });

    setFilteredTasks(filtered);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === updated.Id ? updated : t));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully!");
      }
      
      setShowAddForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task");
      throw err;
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updated = await taskService.complete(taskId);
      setTasks(prev => prev.map(t => t.Id === updated.Id ? updated : t));
      toast.success("Task completed successfully!");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-8 pb-24">
      {!showAddForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Tasks</h1>
              <p className="text-gray-600">Organize and track your farming activities</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
{tasks.filter(t => !t.Completed_c).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
<div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {tasks.filter(t => t.Completed_c).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </Card>
            <Card className="p-4">
<div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  {tasks.filter(t => !t.Completed_c && new Date(t.DueDate_c) < new Date()).length}
                </div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
<div className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">
                  {tasks.filter(t => !t.Completed_c && t.Priority_c?.toLowerCase() === "high").length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <TaskFilters filters={filters} onFiltersChange={setFilters} />

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <Empty
              icon="CheckSquare"
              title="No tasks created yet"
              description="Start organizing your farm work by creating your first task."
              actionLabel="Create First Task"
              onAction={() => setShowAddForm(true)}
            />
          ) : filteredTasks.length === 0 ? (
            <Empty
              icon="Filter"
              title="No tasks match your filters"
              description="Try adjusting your filters to see more tasks."
              actionLabel="Clear Filters"
              onAction={() => setFilters({ status: "all", priority: "all", category: "all" })}
            />
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <AddTaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Tasks;