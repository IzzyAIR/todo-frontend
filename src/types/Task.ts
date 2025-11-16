export interface Task {
  id: string;
  username: string;
  email: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  username: string;
  email: string;
  text: string;
}

export interface UpdateTaskData {
  text?: string;
  completed?: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export type SortField = "username" | "email" | "completed";
export type SortDirection = "asc" | "desc";
