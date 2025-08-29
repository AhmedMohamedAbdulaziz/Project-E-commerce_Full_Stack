import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
// Fixed relative path to services folder (two levels up from /components/cat)
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-cat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cat.component.html',
  styleUrl: './cat.component.css'
})
export class CatComponent {
  categories: Category[] = [];
  newCategory = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    const name = this.newCategory.trim();
    if (!name) return;

    this.categoryService.createCategory({ name })
      .subscribe(() => {
        this.loadCategories();
        this.newCategory = '';

        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: `Category "${name}" added ✅`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      });
  }

  deleteCategory(id: string, name: string) {
    Swal.fire({
      title: `Delete "${name}"?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id)
          .subscribe(() => {
            this.loadCategories();

            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: `Category "${name}" removed ✅`,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
          });
      }
    });
  }

}
