import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateUserRequest, UserResponse,
  ChatRequest, ChatResponse, MessageResponse
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private readonly BASE_URL = 'https://calisthenics-coach-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // ─── Users ────────────────────────────────────────────────────────────────

  createUser(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.BASE_URL}/users`, request);
  }

  getUser(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.BASE_URL}/users/${userId}`);
  }

  updateUser(userId: number, request: CreateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.BASE_URL}/users/${userId}`, request);
  }

  // ─── Chat ─────────────────────────────────────────────────────────────────

  sendMessage(userId: number, message: string): Observable<ChatResponse> {
    const body: ChatRequest = { message };
    return this.http.post<ChatResponse>(`${this.BASE_URL}/chat/${userId}`, body);
  }

  getChatHistory(userId: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.BASE_URL}/chat/${userId}/history`);
  }
}
