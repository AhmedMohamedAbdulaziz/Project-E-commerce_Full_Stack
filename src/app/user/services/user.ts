import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsers } from '../../types/users';

@Injectable({
  providedIn: 'root'
})
export class Userservice {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  
  register(userData: IUsers): Observable<{ success: boolean; token: string; user: IUsers }> {
    return this.http.post<{ success: boolean; token: string; user: IUsers }>(
      `${this.apiUrl}/register`,
      userData
    );
  }

 login(credentials: { email: string; password: string }): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${this.apiUrl}/login`, 
    credentials
  );
}
 
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }



 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

 
  logout(): void {
   localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  
  getUsers(): Observable<IUsers[]> {
    const token = this.getToken() || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<IUsers[]>(this.apiUrl, { headers });
  }
  saveUser(user: IUsers): void {
  localStorage.setItem('user', JSON.stringify(user));
}

getUser(): IUsers | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
isAdmin(): boolean {
  const user = this.getUser();
  if(user && user.role === 'admin') {
    return true;
  }
  return false;
}
}
