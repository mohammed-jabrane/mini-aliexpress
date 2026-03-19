import { ProductActions } from './product.actions';
import { productReducer } from './product.reducer';
import { initialProductState } from './product.state';
import { Product, Category } from '../../shared/models/product.model';

describe('Product Reducer', () => {
  const mockProduct: Product = {
    id: '1', name: 'Laptop', description: 'A laptop', price: 999,
    stock: 10, categoryId: 'cat1', sellerId: 's1', images: ['img.jpg'],
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  it('should return the initial state when unknown action', () => {
    // GIVEN
    const action = { type: 'Unknown' };

    // WHEN
    const result = productReducer(initialProductState, action);

    // THEN
    expect(result).toBe(initialProductState);
  });

  it('should set loading on loadProducts', () => {
    // GIVEN
    const state = { ...initialProductState, loading: false };

    // WHEN
    const result = productReducer(state, ProductActions.loadProducts({}));

    // THEN
    expect(result.loading).toBeTrue();
    expect(result.error).toBeNull();
  });

  it('should populate products on loadProductsSuccess', () => {
    // GIVEN
    const products: Product[] = [
      mockProduct,
      { ...mockProduct, id: '2', name: 'Phone', createdAt: '2024-01-02' },
    ];
    const state = { ...initialProductState, loading: true };

    // WHEN
    const result = productReducer(state, ProductActions.loadProductsSuccess({ products }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.ids.length).toBe(2);
  });

  it('should set error on loadProductsFailure', () => {
    // GIVEN
    const state = { ...initialProductState, loading: true };

    // WHEN
    const result = productReducer(state, ProductActions.loadProductsFailure({ error: 'Network error' }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.error).toBe('Network error');
  });

  it('should upsert product on loadProductSuccess', () => {
    // GIVEN
    const state = { ...initialProductState, loading: true };

    // WHEN
    const result = productReducer(state, ProductActions.loadProductSuccess({ product: mockProduct }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.entities['1']).toEqual(mockProduct);
  });

  it('should set error on loadProductFailure', () => {
    // GIVEN
    const state = { ...initialProductState, loading: true };

    // WHEN
    const result = productReducer(state, ProductActions.loadProductFailure({ error: 'Not found' }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.error).toBe('Not found');
  });

  it('should set categories on loadCategoriesSuccess', () => {
    // GIVEN
    const categories: Category[] = [{ id: 'c1', name: 'Electronics', parentId: null, children: [] }];
    const state = { ...initialProductState, loading: true };

    // WHEN
    const result = productReducer(state, ProductActions.loadCategoriesSuccess({ categories }));

    // THEN
    expect(result.loading).toBeFalse();
    expect(result.categories).toEqual(categories);
  });

  it('should set selectedProductId on selectProduct', () => {
    // GIVEN
    const state = { ...initialProductState };

    // WHEN
    const result = productReducer(state, ProductActions.selectProduct({ productId: '1' }));

    // THEN
    expect(result.selectedProductId).toBe('1');
  });

  it('should set searchQuery on setSearchQuery', () => {
    // GIVEN
    const state = { ...initialProductState };

    // WHEN
    const result = productReducer(state, ProductActions.setSearchQuery({ query: 'laptop' }));

    // THEN
    expect(result.searchQuery).toBe('laptop');
  });

});
