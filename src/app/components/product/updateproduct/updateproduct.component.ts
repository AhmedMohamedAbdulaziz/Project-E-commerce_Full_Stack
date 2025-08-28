import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-updateproduct',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})
export class UpdateproductComponent implements OnInit {
  updateForm!: FormGroup;
  submitted = false;
  productId!: string;
  selectedFile: File | null = null;
  isAdminUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdminUser = this.authService.isAdmin();
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.updateForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      price: ["", [Validators.required, Validators.min(0)]],
      stock: ["", [Validators.required, Validators.min(0)]],

    });
    this.productService.getProduct(this.productId).subscribe(product => {
      this.updateForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,

      });
    });
  }

  get formControls() {
    return this.updateForm.controls;
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpdate() {
    this.submitted = true;
    if (!this.isAdminUser) {
      alert("You are not authorized to update products!");
      return;
    }
    if (this.updateForm.valid) {
      const formData = new FormData();
      formData.append("name", this.updateForm.get("name")!.value);
      formData.append("description", this.updateForm.get("description")!.value);
      formData.append("price", this.updateForm.get("price")!.value);
      formData.append("stock", this.updateForm.get("stock")!.value);

      if (this.selectedFile) {
        formData.append("image", this.selectedFile);
      }
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: (res) => {
          console.log("Updated:", res);
          alert("Product updated successfully!");
        },
        error: (err) => console.error("Update error:", err)
      });
    }
  }
}
