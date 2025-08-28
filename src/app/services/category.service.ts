import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  _id?: string;  // optional, عشان عند الإنشاء ما يكونش موجود
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  private baseUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  // Get all categories
getCategories(): Observable<Category[]> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<Category[]>(this.baseUrl, { headers });
}

// Get single category
getCategoryById(id: string): Observable<Category> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<Category>(`${this.baseUrl}/${id}`, { headers });
}

// Create category
createCategory(category: Category): Observable<Category> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post<Category>(this.baseUrl, category, { headers });
}

// Update category
updateCategory(id: string, category: Category): Observable<Category> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.put<Category>(`${this.baseUrl}/${id}`, category, { headers });
}

// Delete category
deleteCategory(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers });
}

}
