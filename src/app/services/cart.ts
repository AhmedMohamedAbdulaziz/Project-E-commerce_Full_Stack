import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../types/products';
import { CartItem } from '../types/cart-item';
import { OrdersService } from './orders';
import {
  CreateOrderRequest,
  OrderItem,
  ShippingAddress,
} from '../types/orders';
import { Userservice } from '../user/services/user';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);

  constructor(
    private ordersService: OrdersService,
    private userService: Userservice
  ) {}

  getCartCounter(): Observable<number> {
    return this.cartCounter.asObservable();
  }

  incrementCartCounter(): void {
    this.cartCounter.next(this.cartCounter.value + 1);
  }

  decrementCartCounter(): void {
    this.cartCounter.next(Math.max(0, this.cartCounter.value - 1));
  }

  // --------------------------------------------------------------------------------------- //

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product._id === product._id
    );

    // Ensure product image has the correct URL
    const productWithCorrectImage = {
      ...product,
      image: product.image
        ? `http://localhost:3000/uploads/${product.image}`
        : 'assets/images/placeholder.png'
    };

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.next(updatedItems);
    } else {
      const newItem: CartItem = { product: productWithCorrectImage, quantity };
      this.cartItems.next([...currentItems, newItem]);
    }

    this.cartCounter.next(this.cartCounter.value + quantity);
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    const itemToRemove = currentItems.find(
      (item) => item.product._id == productId
    );

    if (itemToRemove) {
      const updatedItems = currentItems.filter(
        (item) => item.product._id !== productId
      );
      this.cartItems.next(updatedItems);
      this.cartCounter.next(
        Math.max(0, this.cartCounter.value - itemToRemove.quantity)
      );
    }
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product._id === productId
    );

    if (itemIndex !== -1) {
      const updatedItems = [...currentItems];
      const oldQuantity = updatedItems[itemIndex].quantity;

      if (quantity != 0) {
        updatedItems[itemIndex].quantity = quantity;
        this.cartCounter.next(this.cartCounter.value - oldQuantity + quantity);
      } else {
        updatedItems.splice(itemIndex, 1);
        this.cartCounter.next(
          Math.max(0, this.cartCounter.value - oldQuantity)
        );
      }

      this.cartItems.next(updatedItems);
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.cartCounter.next(0);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  // New checkout functionality
  isUserLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  getCurrentUserId(): string | null {
    const user = this.userService.getUser();
    return user?._id || null;
  }

  prepareOrderItems(): Array<{product: string; quantity: number}> {
    return this.cartItems.value.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));
  }

  calculateShippingCost(country: string): number {
    const itemsPrice = this.getCartTotal();
    return this.ordersService.calculateShippingCost(itemsPrice, country);
  }

  getTotalWithShipping(country: string): number {
    const itemsPrice = this.getCartTotal();
    const shippingCost = this.calculateShippingCost(country);
    return itemsPrice + shippingCost;
  }

  checkout(shippingAddress: ShippingAddress, notes?: string): Observable<any> {
    if (!this.isUserLoggedIn()) {
      throw new Error('User must be logged in to checkout');
    }

    if (this.cartItems.value.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderData: CreateOrderRequest = {
      items: this.prepareOrderItems(),
      shippingAddress,
      notes,
    };

    return this.ordersService.createOrder(orderData);
  }

  // Get cart item count for a specific product
  getItemQuantity(productId: string): number {
    const item = this.cartItems.value.find(
      (item) => item.product._id === productId
    );
    return item ? item.quantity : 0;
  }

  // Check if product is in cart
  isProductInCart(productId: string): boolean {
    return this.cartItems.value.some((item) => item.product._id === productId);
  }
}
