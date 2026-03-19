import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CartService } from './cart.service';
import { Cart } from '../../../shared/models/cart.model';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const mockCart: Cart = {
    items: [{ productId: 'p1', productName: 'Laptop', unitPrice: 999, quantity: 1, imageUrl: 'img.jpg' }],
    totalAmount: 999,
    totalItems: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET cart', () => {
    // WHEN
    service.getCart().subscribe(result => {
      // THEN
      expect(result).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should POST to add item', () => {
    // WHEN
    service.addItem('p1', 2).subscribe(result => {
      // THEN
      expect(result).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: 'p1', quantity: 2 });
    req.flush(mockCart);
  });

  it('should PUT to update item', () => {
    // WHEN
    service.updateItem('p1', 5).subscribe(result => {
      // THEN
      expect(result).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/items/p1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ quantity: 5 });
    req.flush(mockCart);
  });

  it('should DELETE to remove item', () => {
    // GIVEN
    const emptyCart: Cart = { items: [], totalAmount: 0, totalItems: 0 };

    // WHEN
    service.removeItem('p1').subscribe(result => {
      // THEN
      expect(result).toEqual(emptyCart);
    });

    const req = httpMock.expectOne('/api/cart/items/p1');
    expect(req.request.method).toBe('DELETE');
    req.flush(emptyCart);
  });
});
