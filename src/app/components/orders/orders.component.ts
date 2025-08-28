import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders';
import { Order } from '../../types/orders';
import { Userservice } from '../../user/services/user';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  selectedOrder: Order | null = null;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private userService: Userservice
  ) {}

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.ordersService.getUserOrders().subscribe({
      next: (response) => {
        // Handle the response structure from backend: { orders: Order[] }
        const orders = response.orders || response || [];
        this.orders = orders.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        if (
          error.status === 401 ||
          error.message === 'No authentication token found'
        ) {
          this.error = 'Please log in to view your orders.';
          this.userService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load orders. Please try again.';
        }
        this.loading = false;
      },
    });
  }

  selectOrder(order: Order) {
    this.selectedOrder = this.selectedOrder?._id === order._id ? null : order;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'confirmed':
        return '#3498db';
      case 'shipped':
        return '#9b59b6';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  trackByOrderId(index: number, order: Order) {
    return order._id;
  }
}
