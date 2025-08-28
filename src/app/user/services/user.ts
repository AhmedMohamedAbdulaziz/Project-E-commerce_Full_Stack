import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsers } from '../../types/users';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private get canUseStorage(): boolean {
    return (
      isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined'
    );
  }

  register(userData: IUsers): Observable<IUsers> {
    return this.http.post<IUsers>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  saveToken(token: string): void {
    if (this.canUseStorage) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!this.canUseStorage) return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (this.canUseStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getUsers(): Observable<IUsers[]> {
    const token = this.getToken() || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<IUsers[]>(this.apiUrl, { headers });
  }
  saveUser(user: IUsers): void {
    if (this.canUseStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  getUser(): IUsers | null {
    if (!this.canUseStorage) return null;
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && user.role === 'admin';
  }
}
