import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return { ...task };
  }

  async getByFarmId(farmId) {
    await this.delay(250);
    return this.tasks.filter(t => t.farmId === farmId.toString()).map(t => ({ ...t }));
  }

  async create(taskData) {
    await this.delay(400);
    const newId = Math.max(...this.tasks.map(t => t.Id)) + 1;
    const newTask = {
      Id: newId,
      ...taskData,
      farmId: taskData.farmId.toString(),
      cropId: taskData.cropId?.toString() || "",
      completed: false
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay(350);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
      farmId: taskData.farmId?.toString() || this.tasks[index].farmId,
      cropId: taskData.cropId?.toString() || this.tasks[index].cropId
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    const deleted = this.tasks.splice(index, 1)[0];
    return { ...deleted };
  }

  async complete(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index].completed = true;
    return { ...this.tasks[index] };
  }

  async getUpcoming(days = 7) {
    await this.delay(250);
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    
    return this.tasks
      .filter(t => !t.completed && new Date(t.dueDate) <= future)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(t => ({ ...t }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const taskService = new TaskService();