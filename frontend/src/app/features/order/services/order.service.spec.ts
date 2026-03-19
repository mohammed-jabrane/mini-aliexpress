import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { Order, PlaceOrderRequest, UpdateOrderStatusRequest } from '../../../shared/models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder: Order = {
    id: 'o1', userId: 'u1',
    items: [{ productId: 'p1', productName: 'Laptop', quantity: 1, unitPrice: 999 }],
    status: 'PENDING', totalAmount: 999,
    shippingAddress: { street: '123 Main', city: 'Paris', zipCode: '75001', country: 'FR' },
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to place an order', () => {
    // GIVEN
    const request: PlaceOrderRequest = {
      shippingAddress: { street: '123 Main', city: 'Paris', zipCode: '75001', country: 'FR' },
    };

    // WHEN
    service.placeOrder(request).subscribe(result => {
      // THEN
      expect(result).toEqual(mockOrder);
    });

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockOrder);
  });

  it('should GET a single order', () => {
    // WHEN
    service.getOrder('o1').subscribe(result => {
      // THEN
      expect(result).toEqual(mockOrder);
    });

    const req = httpMock.expectOne('/api/orders/o1');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should GET all orders', () => {
    // WHEN
    service.getOrders().subscribe(result => {
      // THEN
      expect(result).toEqual([mockOrder]);
    });

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('GET');
    req.flush([mockOrder]);
  });

  it('should PATCH to update order status', () => {
    // GIVEN
    const request: UpdateOrderStatusRequest = { status: 'SHIPPED' };
    const updated = { ...mockOrder, status: 'SHIPPED' as const };

    // WHEN
    service.updateOrderStatus('o1', request).subscribe(result => {
      // THEN
      expect(result).toEqual(updated);
    });

    const req = httpMock.expectOne('/api/orders/o1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);
    req.flush(updated);
  });
});
