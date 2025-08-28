import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Product } from '../../../types/products';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router, private cartService: CartService) {}

  viewDetails(id: string) {
    this.router.navigate(['/details', id]);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
