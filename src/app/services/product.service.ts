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

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, productData);
  }

  updateProduct(id: string, productData: Product | FormData): Observable<any> {
  return this.http.patch(`${this.baseUrl}/${id}`, productData);
}


  deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`);
}

}
