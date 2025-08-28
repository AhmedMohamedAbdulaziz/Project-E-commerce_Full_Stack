import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, OrderResponse } from '../types/orders';
import { Userservice } from '../user/services/user';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private userService: Userservice) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Create a new order
  createOrder(orderData: CreateOrderRequest): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, orderData, { headers });
  }

  // Get all orders for the current user
  getUserOrders(): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.apiUrl}/my-orders`, { headers });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Get a specific order by ID
  getOrderById(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, { headers });
  }

  // Update order status (admin only)
  updateOrderStatus(orderId: string, status: Order['status']): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(
      `${this.apiUrl}/${orderId}/status`,
      { status },
      { headers }
    );
  }

  // Cancel an order
  cancelOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${orderId}/cancel`, {
      headers,
    });
  }

  // Get all orders (admin only)
  getAllOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }

  // Calculate shipping cost based on location and order value
  calculateShippingCost(itemsPrice: number, country: string): number {
    // Basic shipping calculation logic - matches backend logic
    if (country.toLowerCase() === 'egypt') {
      return itemsPrice > 1000 ? 0 : 100; // Free shipping for orders over 1000 EGP, 100 EGP otherwise
    } else {
      return 200; // International shipping
    }
  }
}
