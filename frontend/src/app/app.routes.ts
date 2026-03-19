import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES),
  },
  // {
  //   path: 'cart',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES),
  // },
  // {
  //   path: 'orders',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/order/order.routes').then(m => m.ORDER_ROUTES),
  // },
  // {
  //   path: 'seller',
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['ROLE_SELLER'] },
  //   loadChildren: () => import('./features/seller/seller.routes').then(m => m.SELLER_ROUTES),
  // },
  // {
  //   path: 'admin',
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['ROLE_ADMIN'] },
  //   loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  // },
];
