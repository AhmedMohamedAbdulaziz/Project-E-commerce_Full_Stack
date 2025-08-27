import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddProductComponent {
  addForm: FormGroup;
  submitted = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.addForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
  description: ['', [Validators.required, Validators.minLength(5)]],
  price: ['', [Validators.required, Validators.min(0)]],
  stock: ['', [Validators.required, Validators.min(0)]],
  category: ["", Validators.required],
  image: ['']
});

  }

  get formControls() {
    return this.addForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addForm.value.name);
      formData.append('description', this.addForm.value.description);
      formData.append('price', this.addForm.value.price);
      formData.append('stock', this.addForm.value.stock);
      formData.append("category", this.addForm.get("category")!.value);
      if (this.selectedFile) formData.append('image', this.selectedFile, this.selectedFile.name);



      this.productService.addProduct(formData).subscribe({
        next: (res) => {
          console.log('New Product Added:', res);
          alert('Product added successfully!');
          this.addForm.reset();
          this.selectedFile = null;
          this.submitted = false;
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Failed to add product. Check the backend.');
        }
      });
    }
  }
}
