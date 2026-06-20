import { Injectable, signal } from '@angular/core';
import { UserResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserStateService {

  private readonly STORAGE_KEY = 'coach_user_id';

  // Signal Angular 17+ pour réactivité dans les composants
  currentUser = signal<UserResponse | null>(null);

  saveUser(user: UserResponse): void {
    this.currentUser.set(user);
    localStorage.setItem(this.STORAGE_KEY, String(user.id));
  }

  getSavedUserId(): number | null {
    const id = localStorage.getItem(this.STORAGE_KEY);
    return id ? Number(id) : null;
  }

  clearUser(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.getSavedUserId() !== null;
  }
}
