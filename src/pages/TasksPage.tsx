import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TaskCard } from "../components/TaskCard";
import { Pagination } from "../components/Pagination";
import { SortControls } from "../components/SortControls";
import { SortField, SortDirection } from "../types/Task";
import { buildQuery } from "../utils";
import { useStore } from "../store/useStore";

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasks, isTasksLoading, tasksError, loadTasks } = useStore();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortField = (searchParams.get("sort_field") || undefined) as
    | SortField
    | undefined;
  const sortDirection = (searchParams.get("sort_direction") ||
    "asc") as SortDirection;

  useEffect(() => {
    loadTasks(page, sortField, sortDirection);
  }, [page, sortField, sortDirection, loadTasks]);

  const handlePageChange = (newPage: number) => {
    const query = buildQuery({
      page: newPage,
    });

    navigate(`/?${query}`);
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    const query = buildQuery({
      page,
      sort_field: field,
      sort_direction: direction,
    });

    navigate(`/?${query}`);
  };

  if (isTasksLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Загрузка задач...</div>
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Ошибка при загрузке задач. Пожалуйста, попробуйте еще раз.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {tasks?.tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Задач пока нет</div>
          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Создать первую задачу
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {tasks?.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {tasks && (
            <Pagination
              currentPage={tasks.currentPage}
              totalPages={tasks.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            Всего задач: {tasks?.totalTasks}
          </div>
        </>
      )}
    </div>
  );
};
