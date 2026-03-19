import {
  selectAllProducts,
  selectProductEntities,
  selectSelectedProduct,
  selectCategories,
  selectProductLoading,
  selectProductError,
} from './product.selectors';
import { ProductState, productAdapter, initialProductState } from './product.state';
import { Product, Category } from '../../shared/models/product.model';

describe('Product Selectors', () => {
  const mockProduct: Product = {
    id: '1', name: 'Laptop', description: 'A laptop', price: 999,
    stock: 10, categoryId: 'cat1', sellerId: 's1', images: ['img.jpg'],
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  const mockProduct2: Product = {
    id: '2', name: 'Phone', description: 'A phone', price: 599,
    stock: 20, categoryId: 'cat1', sellerId: 's1', images: ['img2.jpg'],
    createdAt: '2024-01-02', updatedAt: '2024-01-02',
  };

  const populatedState: ProductState = productAdapter.setAll(
    [mockProduct, mockProduct2],
    { ...initialProductState, selectedProductId: '1', categories: [{ id: 'c1', name: 'Electronics', parentId: null, children: [] }] },
  );

  it('should select all products', () => {
    // GIVEN
    const state = { product: populatedState };

    // WHEN
    const result = selectAllProducts(state);

    // THEN
    expect(result.length).toBe(2);
  });

  it('should select product entities', () => {
    // GIVEN
    const state = { product: populatedState };

    // WHEN
    const result = selectProductEntities(state);

    // THEN
    expect(result['1']).toEqual(mockProduct);
    expect(result['2']).toEqual(mockProduct2);
  });

  it('should select selected product', () => {
    // GIVEN
    const state = { product: populatedState };

    // WHEN
    const result = selectSelectedProduct(state);

    // THEN
    expect(result).toEqual(mockProduct);
  });

  it('should select categories', () => {
    // GIVEN
    const state = { product: populatedState };

    // WHEN
    const result = selectCategories(state);

    // THEN
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Electronics');
  });

  it('should select loading', () => {
    // GIVEN
    const loadingState: ProductState = { ...populatedState, loading: true };
    const state = { product: loadingState };

    // WHEN
    const result = selectProductLoading(state);

    // THEN
    expect(result).toBeTrue();
  });

  it('should select error', () => {
    // GIVEN
    const errorState: ProductState = { ...populatedState, error: 'Something failed' };
    const state = { product: errorState };

    // WHEN
    const result = selectProductError(state);

    // THEN
    expect(result).toBe('Something failed');
  });

});
