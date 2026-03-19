import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, Category } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(query?: string, categoryId?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
