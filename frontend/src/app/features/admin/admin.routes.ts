import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CategoryManagementComponent } from './pages/category-management/category-management.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'categories', component: CategoryManagementComponent },
];
