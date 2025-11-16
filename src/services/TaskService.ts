import api from "../api/axios";
import {
  Task,
  TasksResponse,
  CreateTaskData,
  UpdateTaskData,
  SortField,
  SortDirection,
} from "../types/Task";
import { buildQuery } from "../utils";

interface TasksParams {
  page?: number;
  sort_field?: SortField;
  sort_direction?: SortDirection;
}

class TaskService {
  async getTasks(prop: TasksParams = {}): Promise<TasksResponse> {
    const query = buildQuery(prop);

    const { data } = await api.get(`/tasks?${query}`);

    if (!data) {
      throw new Error("Не удалось загрузить задачи");
    }

    return data;
  }

  async getTask(id: string): Promise<Task> {
    const { data } = await api.get(`/tasks/${id}`);

    if (!data) {
      throw new Error("Задача не найдена");
    }

    return data;
  }

  async createTask(newData: CreateTaskData): Promise<Task> {
    const { data } = await api.post("/tasks", newData);

    if (!data) {
      throw new Error("Не удалось создать задачу");
    }

    return data;
  }

  async updateTask(id: string, newData: UpdateTaskData): Promise<Task> {
    const { data } = await api.put(`/tasks/${id}`, newData);

    if (!data) {
      throw new Error("Не удалось обновить задачу");
    }

    return data;
  }
}

export const taskService = new TaskService();
