import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrdersService } from '../../services/orders';
import { CartItem } from '../../types/cart-item';
import { ShippingAddress } from '../../types/orders';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  isProcessing = false;
  errorMessage = '';
  successMessage = '';
  selectedCountry = 'Egypt';

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['Egypt', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)],
      ],
      notes: [''],
    });
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/mycart']);
      }
    });

    if (!this.cartService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
    }

    // Update shipping cost when country changes
    this.checkoutForm.get('country')?.valueChanges.subscribe((country) => {
      this.selectedCountry = country;
    });
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getShippingCost(): number {
    return this.cartService.calculateShippingCost(this.selectedCountry);
  }

  getTotalWithShipping(): number {
    return this.cartService.getTotalWithShipping(this.selectedCountry);
  }

  isFreeShipping(): boolean {
    return this.getShippingCost() === 0;
  }

  onSubmit() {
    if (this.checkoutForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      this.errorMessage = '';
      this.successMessage = '';

      const shippingAddress: ShippingAddress = {
        street: this.checkoutForm.value.street,
        city: this.checkoutForm.value.city,
        country: this.checkoutForm.value.country,
        phoneNumber: this.checkoutForm.value.phoneNumber,
      };

      const notes = this.checkoutForm.value.notes;

      this.cartService.checkout(shippingAddress, notes).subscribe({
        next: (response) => {
          this.isProcessing = false;
          this.successMessage = `Order placed successfully! Order number: ${response.order.orderNumber}`;
          this.cartService.clearCart();
          
          // Redirect to order confirmation after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 3000);
        },
        error: (error) => {
          this.isProcessing = false;
          this.errorMessage =
            error.error?.message || 'Failed to place order. Please try again.';
        },
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
      if (field.errors['pattern']) {
        return `Please enter a valid ${fieldName}`;
      }
    }
    return '';
  }

  trackByProductId(index: number, item: CartItem) {
    return item.product._id;
  }
}
