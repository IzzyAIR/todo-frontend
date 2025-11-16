import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";

export const Header: React.FC = () => {
  const { isAdmin, logout, isLoading: authLoading } = useStore();
  const location = useLocation();

  return (
    <header className=" text-blue-500 shadow-lg bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold duration-300 hover:text-blue-200"
          >
            ToDo App
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={` duration-300 hover:text-blue-300   ${
                location.pathname === "/" ? "text-blue-300" : ""
              }`}
            >
              Задачи
            </Link>

            <Link
              to="/create"
              className={`duration-300 hover:text-blue-300  ${
                location.pathname === "/create" ? "text-blue-300" : ""
              }`}
            >
              Создать задачу
            </Link>

            {authLoading ? (
              <div className="bg-gray-500 px-3 py-1 rounded text-sm">
                Загрузка...
              </div>
            ) : isAdmin ? (
              <button
                onClick={logout}
                className="bg-red-500 duration-300 hover:bg-red-600 px-3 py-1 text-white rounded text-sm"
              >
                Выйти
              </button>
            ) : (
              <Link
                to="/admin/login"
                className={`bg-green-500 duration-300 hover:bg-green-600 px-3 py-1 rounded text-white text-sm ${
                  location.pathname === "/admin/login" ? "bg-green-700" : ""
                }`}
              >
                Вход админа
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
