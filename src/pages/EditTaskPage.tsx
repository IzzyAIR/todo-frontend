import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";

export const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    isAdmin, 
    isLoading: authLoading, 
    currentTask, 
    isTasksLoading, 
    tasksError,
    editTaskForm,
    setEditTaskForm,
    setEditTaskFormError,
    resetEditTaskForm,
    loadTask,
    updateTask
  } = useStore();
  
  const { text, completed, error: formError, isSubmitting } = editTaskForm;


  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    if (id) {
      loadTask(id);
    }
  }, [id, isAdmin, authLoading, navigate, loadTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setEditTaskFormError("Текст задачи не может быть пустым");
      return;
    }

    if (!id) return;

    try {
      await updateTask(id, { text, completed });
      resetEditTaskForm();
      navigate("/");
    } catch (error: any) {
      // Error handling is done in the store
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setEditTaskForm(name, type === "checkbox" ? checked : value);
  };

  if (authLoading || (!isAdmin && !authLoading)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">
            {authLoading ? "Проверка авторизации..." : "Перенаправление..."}
          </div>
        </div>
      </div>
    );
  }

  if (isTasksLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Загрузка задачи...</div>
        </div>
      </div>
    );
  }

  if (tasksError || !currentTask) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Задача не найдена или произошла ошибка при загрузке.
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Вернуться к списку задач
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Вернуться к списку задач
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Редактирование задачи
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">
            Информация о задаче
          </h3>
          <p>
            <strong>Автор:</strong> {currentTask.username}
          </p>
          <p>
            <strong>Email:</strong> {currentTask.email}
          </p>
          <p>
            <strong>Создана:</strong>{" "}
            {new Date(currentTask.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Текст задачи *
            </label>
            <textarea
              id="text"
              name="text"
              value={text}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={completed}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-sm text-gray-900"
            >
              Задача выполнена
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
