import React from "react";
import { Link } from "react-router-dom";
import { Task } from "../types/Task";
import { useStore } from "../store/useStore";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { isAdmin } = useStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-800">{task.username}</span>
            {task.completed && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✓ Выполнено
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{task.email}</p>
        </div>

        {isAdmin && (
          <Link
            to={`/edit/${task.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Редактировать
          </Link>
        )}
      </div>

      <div className="mb-4">
        <p
          className={`text-gray-800 ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.text}
        </p>
      </div>

      <div className="text-xs text-gray-500">
        Создана: {formatDate(task.createdAt)}
        {task.createdAt !== task.updatedAt && (
          <span className="ml-4">Обновлена: {formatDate(task.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};
