import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../types/cart-item';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartCount: number = 0;
  cartItems: CartItem[] = [];
  isUserLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCartCounter().subscribe((count: number) => {
      this.cartCount = count;
    });

    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });

    this.isUserLoggedIn = this.cartService.isUserLoggedIn();
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cartService.updateItemQuantity(productId, quantity);
    }
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  trackByProductId(index: number, item: CartItem) {
    return item.product._id;
  }

  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}
