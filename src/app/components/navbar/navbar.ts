import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IUsers } from '../../types/users';
import { Userservice } from '../../user/services/user';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  cartCount = 0;
  currentUser: IUsers | null = null;

  constructor(
    private userService: Userservice,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.cartService
      .getCartCounter()
      .subscribe((data) => (this.cartCount = data));
  }

  logout(): void {
    this.userService.logout();
    this.currentUser = null;
  }
}
