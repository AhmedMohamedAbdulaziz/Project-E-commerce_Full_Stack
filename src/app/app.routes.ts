import { Routes } from '@angular/router';
import { Login } from './components/users/login/login';
import { NotFound } from './components/not-found/not-found';
import { Register } from './components/users/register/register';
import { Profile } from './components/users/profile/profile';

import { ProductsComponent } from './components/product/products/products.component';
import { ProductdetailsComponent } from './components/product/productdetails/productdetails.component';
import { AddProductComponent } from './components/product/addproduct/addproduct.component';
import { UpdateproductComponent } from './components/product/updateproduct/updateproduct.component';
import { DeleteProductComponent } from './components/product/deleteproduct/deleteproduct.component';
import { Cart } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products Page',
  },
  {
    path: 'details/:id',
    component: ProductdetailsComponent,
    title: 'Product Details',
  },
  {
    path: 'add',
    component: AddProductComponent,
    title: 'Add Product',
  },
  {
    path: 'update/:id',
    component: UpdateproductComponent,
    title: 'Update Product',
  },
  {
    path: 'delete/:id',
    component: DeleteProductComponent,
    title: 'Delete Product',
  },
  {
    path: 'mycart',
    component: Cart,
    title: 'My Cart',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Checkout',
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'My Orders',
  },
  {
    path: '**',
    component: NotFound,
  },
];
