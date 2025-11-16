import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAdmin,
    isLoading,
    loginForm,
    setLoginForm,
    resetLoginForm,
    loginAdmin,
  } = useStore();

  const { username, password, error, isSubmitting } = loginForm;

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      await loginAdmin(username, password);
      resetLoginForm();
      navigate("/");
    } catch (error: any) {
      // Error in  store
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(name, value);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Проверка авторизации...</div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          Вернуться к списку задач
        </button>
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Вход администратора
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Логин
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};
