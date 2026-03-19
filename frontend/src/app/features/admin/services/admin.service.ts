import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { AdminUser, DashboardStats } from '../../../shared/models/admin.model';
import { Product, Category } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      products: this.http.get<Product[]>(`${this.apiUrl}/products`),
      categories: this.http.get<Category[]>(`${this.apiUrl}/categories`),
    }).pipe(
      map(({ products, categories }) => ({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: 0,
        totalUsers: 0,
      }))
    );
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/admin/users`);
  }

  banUser(userId: string): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/admin/users/${userId}/ban`, {});
  }

  unbanUser(userId: string): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/admin/users/${userId}/unban`, {});
  }

  createCategory(name: string, parentId?: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, { name, parentId });
  }

  updateCategory(id: string, name: string, parentId?: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, { name, parentId });
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
