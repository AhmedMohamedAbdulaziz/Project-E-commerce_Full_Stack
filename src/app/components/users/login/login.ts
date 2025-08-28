import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Userservice } from '../../../user/services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,RouterOutlet],
  templateUrl: '../../users/login/login.html',
  styleUrl: '../../users/login/login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router , private userservice: Userservice) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
      this.loading = true;
      this.userservice.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.userservice.saveToken(res.token);
          this.userservice.saveUser(res.user);
          this.router.navigate(['/products']); 
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Login failed';
        }
      });
    }
  }
}
