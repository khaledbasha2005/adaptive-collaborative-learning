// src/services/apiService.ts

import { auth } from "../firebase";

// ✅ غيّرنا 127.0.0.1 لـ localhost علشان الريأكت يقدر يتصل بالباك-إند
const API_BASE = "http://127.0.0.1:5001/api";

export interface HealthResponse {
  status: string;
  message: string;
  database: string;
}

export interface UserData {
  name: string;
  email: string;
}

class ApiService {

  // التحقق من حالة الباك اند (بدون auth)
  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(API_BASE + "/health");

    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    return await response.json();
  }

  // إرسال بيانات مستخدم (مع auth)
  async addUser(userData: UserData): Promise<any> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(API_BASE + "/addData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    return await response.json();
  }

  // ✅ حذفت أو أوقفت دالة getUsers() لأنها تطلب endpoint /users الغير موجود في السيرفر
  // async getUsers(): Promise<any> { ... }

  // إرسال بيانات عامة (مع auth)
  async sendData(data: any): Promise<any> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(API_BASE + "/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    return await response.json();
  }
}

export const apiService = new ApiService();