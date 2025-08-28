import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../types/products';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

addProduct(productData: any): Observable<Product> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post<Product>(`${this.baseUrl}`, productData, { headers });
}

updateProduct(id: string, productData: Product | FormData): Observable<Product> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.patch<Product>(`${this.baseUrl}/${id}`, productData, { headers });
}


deleteProduct(id: string): Observable<Product> {
  const token = localStorage.getItem('token');
  return this.http.delete<Product>(`${this.baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



}
