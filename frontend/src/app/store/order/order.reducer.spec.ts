import { OrderActions } from './order.actions';
import { orderReducer } from './order.reducer';
import { initialOrderState } from './order.state';
import { Order } from '../../shared/models/order.model';

describe('Order Reducer', () => {
  const mockOrder: Order = {
    id: 'o1', userId: 'u1',
    items: [{ productId: 'p1', productName: 'Laptop', quantity: 1, unitPrice: 999 }],
    status: 'PENDING', totalAmount: 999,
    shippingAddress: { street: '123 Main St', city: 'Paris', zipCode: '75001', country: 'France' },
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  it('should return the initial state when unknown action', () => {
    // GIVEN
    const action = { type: 'Unknown' };

    // WHEN
    const result = orderReducer(initialOrderState, action);

    // THEN
    expect(result).toBe(initialOrderState);
  });

  it('should set loading on placeOrder', () => {
    // GIVEN
    const state = { ...initialOrderState };
    const request = { shippingAddress: mockOrder.shippingAddress };

    // WHEN
    const result = orderReducer(state, OrderActions.placeOrder({ request }));

    // THEN
    expect(result.loading).toBeTrue();
    expect(result.error).toBeNull();
  });

  it('should add order on placeOrderSuccess', () => {
    // GIVEN
    const state = { ...initialOrderState, loading: true };

    // WHEN
    const result = orderReducer(state, OrderActions.placeOrderSuccess({ order: mockOrder }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.ids.length).toBe(1);
    expect(result.entities['o1']).toEqual(mockOrder);
  });

  it('should set error on placeOrderFailure', () => {
    // GIVEN
    const state = { ...initialOrderState, loading: true };

    // WHEN
    const result = orderReducer(state, OrderActions.placeOrderFailure({ error: 'Payment failed' }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.error).toBe('Payment failed');
  });

  it('should upsert order on loadOrderSuccess', () => {
    // GIVEN
    const state = { ...initialOrderState, loading: true };

    // WHEN
    const result = orderReducer(state, OrderActions.loadOrderSuccess({ order: mockOrder }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.entities['o1']).toEqual(mockOrder);
  });

  it('should set all orders on loadOrdersSuccess', () => {
    // GIVEN
    const orders: Order[] = [
      mockOrder,
      { ...mockOrder, id: 'o2', status: 'SHIPPED', createdAt: '2024-01-02' },
    ];
    const state = { ...initialOrderState, loading: true };

    // WHEN
    const result = orderReducer(state, OrderActions.loadOrdersSuccess({ orders }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.ids.length).toBe(2);
  });

  it('should update order on updateOrderStatusSuccess', () => {
    // GIVEN
    const existingState = orderReducer(initialOrderState, OrderActions.placeOrderSuccess({ order: mockOrder }));
    const updatedOrder: Order = { ...mockOrder, status: 'PAID', updatedAt: '2024-01-02' };
    const state = { ...existingState, loading: true };

    // WHEN
    const result = orderReducer(state, OrderActions.updateOrderStatusSuccess({ order: updatedOrder }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.entities['o1']!.status).toBe('PAID');
  });

  it('should set selectedOrderId on selectOrder', () => {
    // GIVEN
    const state = { ...initialOrderState };

    // WHEN
    const result = orderReducer(state, OrderActions.selectOrder({ orderId: 'o1' }));

    // THEN
    expect(result.selectedOrderId).toBe('o1');
  });

});
