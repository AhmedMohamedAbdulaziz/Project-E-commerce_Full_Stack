import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';

import { Product } from '../../../types/products';
import { CartService } from '../../../services/cart';
@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css'],
})
export class ProductdetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (data: Product) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(' Error loading product', err);
          this.error = 'Failed to load product details';
          this.loading = false;
        },
      });
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  buyNow(product: Product) {
    this.cartService.clearCart();
    this.cartService.addToCart(product);
    this.router.navigate(['/checkout']);
  }
}
