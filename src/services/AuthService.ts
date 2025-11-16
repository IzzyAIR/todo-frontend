import api from "../api/axios";

interface LoginResponse {
  message: string;
  token: string;
}

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post("/admin/login", { username, password });

    if (!data) {
      throw new Error("Ошибка авторизации");
    }

    return data;
  }
}

export const authService = new AuthService();
