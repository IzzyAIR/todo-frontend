/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import toast from "react-hot-toast";
import {
  Task,
  TasksResponse,
  CreateTaskData,
  UpdateTaskData,
} from "../types/Task";
import { taskService } from "../services/TaskService";
import { authService } from "../services/AuthService";

interface AppState {
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;

  tasks: TasksResponse | null;
  currentTask: Task | null;
  isTasksLoading: boolean;
  tasksError: string | null;

  createTaskForm: {
    username: string;
    email: string;
    text: string;
    errors: Record<string, string>;
    isSubmitting: boolean;
  };

  editTaskForm: {
    text: string;
    completed: boolean;
    error: string;
    isSubmitting: boolean;
  };

  loginForm: {
    username: string;
    password: string;
    error: string;
    isSubmitting: boolean;
  };
}

interface AppActions {
  login: (token: string) => void;
  logout: () => void;
  loginAdmin: (username: string, password: string) => Promise<void>;
  checkTokenExpiry: () => void;

  loadTasks: (
    page?: number,
    sortField?: string,
    sortDirection?: string
  ) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  loadTask: (id: string) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;

  setCreateTaskForm: (field: string, value: string) => void;
  setCreateTaskFormErrors: (errors: Record<string, string>) => void;
  resetCreateTaskForm: () => void;

  setEditTaskForm: (field: string, value: string | boolean) => void;
  setEditTaskFormError: (error: string) => void;
  resetEditTaskForm: () => void;

  setLoginForm: (field: string, value: string) => void;
  setLoginFormError: (error: string) => void;
  resetLoginForm: () => void;
}

type Store = AppState & AppActions;

const initialState: AppState = {
  token: null,
  isAdmin: false,
  isLoading: true,

  tasks: null,
  currentTask: null,
  isTasksLoading: false,
  tasksError: null,

  createTaskForm: {
    username: "",
    email: "",
    text: "",
    errors: {},
    isSubmitting: false,
  },

  editTaskForm: {
    text: "",
    completed: false,
    error: "",
    isSubmitting: false,
  },

  loginForm: {
    username: "",
    password: "",
    error: "",
    isSubmitting: false,
  },
};

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: (token: string) => {
          set({ token, isAdmin: true, isLoading: false });
        },

        logout: () => {
          localStorage.removeItem("admin-token");
          set({
            token: null,
            isAdmin: false,
            tasks: null,
            currentTask: null,
          });
          toast.success("Вы успешно вышли из системы");
        },

        loginAdmin: async (username: string, password: string) => {
          const state = get();
          try {
            set({
              loginForm: {
                ...state.loginForm,
                isSubmitting: true,
                error: "",
              },
            });

            const response = await authService.login(username, password);
            localStorage.setItem("admin-token", response.token);

            set({
              token: response.token,
              isAdmin: true,
              loginForm: {
                ...initialState.loginForm,
              },
            });

            toast.success("Успешная авторизация");
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Ошибка авторизации";
            set({
              loginForm: {
                ...state.loginForm,
                isSubmitting: false,
                error: errorMessage,
              },
            });
            throw error;
          }
        },

        checkTokenExpiry: () => {
          const { token } = get();
          if (!token) {
            set({ isLoading: false });
            return;
          }

          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;

            if (payload.exp < currentTime) {
              localStorage.removeItem("admin-token");
              set({
                token: null,
                isAdmin: false,
                isLoading: false,
              });
              toast.error("Сессия истекла. Пожалуйста, войдите снова");
            } else {
              set({ isLoading: false });
            }
          } catch (error) {
            localStorage.removeItem("admin-token");
            set({
              token: null,
              isAdmin: false,
              isLoading: false,
            });
          }
        },

        loadTasks: async (page = 1, sortField, sortDirection = "asc") => {
          try {
            set({ isTasksLoading: true, tasksError: null });

            const result = await taskService.getTasks({
              page,
              sort_field: sortField as any,
              sort_direction: sortDirection as any,
            });

            set({ tasks: result, isTasksLoading: false });
          } catch (error: any) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Ошибка при загрузке задач";
            set({
              tasksError: errorMessage,
              isTasksLoading: false,
            });
          }
        },

        createTask: async (data: CreateTaskData) => {
          const state = get();
          try {
            set({
              createTaskForm: {
                ...state.createTaskForm,
                isSubmitting: true,
                errors: {},
              },
            });

            await taskService.createTask(data);

            set({
              createTaskForm: {
                ...initialState.createTaskForm,
              },
            });

            toast.success("Задача успешно создана!");
          } catch (error: any) {
            if (error.response?.data?.errors) {
              const apiErrors: Record<string, string> = {};
              error.response.data.errors.forEach((err: any) => {
                if (err.param) {
                  apiErrors[err.param] = err.msg;
                }
              });

              set({
                createTaskForm: {
                  ...state.createTaskForm,
                  isSubmitting: false,
                  errors: apiErrors,
                },
              });
            }
            throw error;
          }
        },

        loadTask: async (id: string) => {
          try {
            set({ isTasksLoading: true, tasksError: null });

            const task = await taskService.getTask(id);

            set({
              currentTask: task,
              isTasksLoading: false,
              editTaskForm: {
                text: task.text,
                completed: task.completed,
                error: "",
                isSubmitting: false,
              },
            });
          } catch (error: any) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Ошибка при загрузке задачи";
            set({
              tasksError: errorMessage,
              isTasksLoading: false,
            });
          }
        },

        updateTask: async (id: string, data: UpdateTaskData) => {
          const state = get();
          try {
            set({
              editTaskForm: {
                ...state.editTaskForm,
                isSubmitting: true,
                error: "",
              },
            });

            await taskService.updateTask(id, data);

            set({
              editTaskForm: {
                ...state.editTaskForm,
                isSubmitting: false,
              },
            });

            toast.success("Задача успешно обновлена!");
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Ошибка при обновлении задачи";
            set({
              editTaskForm: {
                ...state.editTaskForm,
                isSubmitting: false,
                error: errorMessage,
              },
            });
            throw error;
          }
        },

        setCreateTaskForm: (field: string, value: string) => {
          const state = get();
          set({
            createTaskForm: {
              ...state.createTaskForm,
              [field]: value,
              errors: {
                ...state.createTaskForm.errors,
                [field]: "",
              },
            },
          });
        },

        setCreateTaskFormErrors: (errors: Record<string, string>) => {
          const state = get();
          set({
            createTaskForm: {
              ...state.createTaskForm,
              errors,
            },
          });
        },

        resetCreateTaskForm: () => {
          set({
            createTaskForm: {
              ...initialState.createTaskForm,
            },
          });
        },

        setEditTaskForm: (field: string, value: string | boolean) => {
          const state = get();
          set({
            editTaskForm: {
              ...state.editTaskForm,
              [field]: value,
              error: "",
            },
          });
        },

        setEditTaskFormError: (error: string) => {
          const state = get();
          set({
            editTaskForm: {
              ...state.editTaskForm,
              error,
            },
          });
        },

        resetEditTaskForm: () => {
          set({
            editTaskForm: {
              ...initialState.editTaskForm,
            },
          });
        },

        setLoginForm: (field: string, value: string) => {
          const state = get();
          set({
            loginForm: {
              ...state.loginForm,
              [field]: value,
              error: "",
            },
          });
        },

        setLoginFormError: (error: string) => {
          const state = get();
          set({
            loginForm: {
              ...state.loginForm,
              error,
            },
          });
        },

        resetLoginForm: () => {
          set({
            loginForm: {
              ...initialState.loginForm,
            },
          });
        },
      }),
      {
        name: "todo-app-storage",
        partialize: (state) => ({
          token: state.token,
        }),
      }
    ),
    {
      name: "todo-app",
    }
  )
);

const token = localStorage.getItem("admin-token");
if (token) {
  useStore.getState().login(token);
}
useStore.getState().checkTokenExpiry();
