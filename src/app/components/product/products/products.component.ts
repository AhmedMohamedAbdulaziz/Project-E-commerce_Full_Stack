import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../../services/product.service';

import { Product } from '../../../types/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];



  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({

    next: (res: Product[]) => {
        this.products = res.map((p: Product) => ({
          ...p,
          image: p.image
            ? `http://localhost:3000/uploads/${p.image}`
            : 'assets/images/placeholder.png'
        }));

      },
      error: (err) => {
        console.error('Error fetching products:', err);

      }
    });
  }
}
