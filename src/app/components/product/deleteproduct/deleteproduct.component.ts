import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-deleteproduct',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deleteproduct.component.html',
})
export class DeleteProductComponent implements OnInit {
  productId!: string;
  isAdminUser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.isAdminUser = this.authService.isAdmin(); 
  }

  confirmDelete() {
    if (!this.isAdminUser) {
      alert("You are not authorized to delete products!");
      return;
    }

    this.productService.deleteProduct(this.productId).subscribe({
      next: (res) => {
        console.log('Deleted:', res);
        alert('Product deleted successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Error deleting product');
      },
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
