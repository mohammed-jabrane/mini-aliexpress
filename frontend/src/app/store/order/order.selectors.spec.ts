import {
  selectAllOrders,
  selectOrderEntities,
  selectOrderTotal,
  selectSelectedOrder,
  selectOrderLoading,
  selectOrderError,
} from './order.selectors';
import { OrderState, orderAdapter, initialOrderState } from './order.state';
import { Order } from '../../shared/models/order.model';

describe('Order Selectors', () => {
  const mockOrder: Order = {
    id: 'o1', userId: 'u1',
    items: [{ productId: 'p1', productName: 'Laptop', quantity: 1, unitPrice: 999 }],
    status: 'PENDING', totalAmount: 999,
    shippingAddress: { street: '123 Main St', city: 'Paris', zipCode: '75001', country: 'France' },
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  const mockOrder2: Order = {
    ...mockOrder, id: 'o2', status: 'SHIPPED', createdAt: '2024-01-02',
  };

  const populatedState: OrderState = orderAdapter.setAll(
    [mockOrder, mockOrder2],
    { ...initialOrderState, selectedOrderId: 'o1' },
  );

  it('should select all orders', () => {
    // GIVEN
    const state = { order: populatedState };

    // WHEN
    const result = selectAllOrders(state);

    // THEN
    expect(result.length).toBe(2);
  });

  it('should select order entities', () => {
    // GIVEN
    const state = { order: populatedState };

    // WHEN
    const result = selectOrderEntities(state);

    // THEN
    expect(result['o1']).toEqual(mockOrder);
  });

  it('should select order total count', () => {
    // GIVEN
    const state = { order: populatedState };

    // WHEN
    const result = selectOrderTotal(state);

    // THEN
    expect(result).toBe(2);
  });

  it('should select selected order', () => {
    // GIVEN
    const state = { order: populatedState };

    // WHEN
    const result = selectSelectedOrder(state);

    // THEN
    expect(result).toEqual(mockOrder);
  });

  it('should select loading', () => {
    // GIVEN
    const loadingState: OrderState = { ...populatedState, loading: true };
    const state = { order: loadingState };

    // WHEN
    const result = selectOrderLoading(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select error', () => {
    // GIVEN
    const errorState: OrderState = { ...populatedState, error: 'Failed to load orders' };
    const state = { order: errorState };

    // WHEN
    const result = selectOrderError(state);

    // THEN
    expect(result).toBe('Failed to load orders');
  });

});
