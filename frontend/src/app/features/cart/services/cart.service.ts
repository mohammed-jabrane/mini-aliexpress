import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cart } from '../../../shared/models/cart.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`);
  }

  addItem(productId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/cart/items`, { productId, quantity });
  }

  updateItem(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/cart/items/${productId}`, { quantity });
  }

  removeItem(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/cart/items/${productId}`);
  }
}
