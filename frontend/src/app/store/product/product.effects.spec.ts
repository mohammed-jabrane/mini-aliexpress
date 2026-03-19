import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { ProductEffects } from './product.effects';
import { ProductActions } from './product.actions';
import { ProductService } from '../../features/product/services/product.service';
import { Product, Category } from '../../shared/models/product.model';

describe('Product Effects', () => {
  let effects: ProductEffects;
  let actions$: Observable<any>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProduct: Product = {
    id: '1', name: 'Laptop', description: 'A laptop', price: 999,
    stock: 10, categoryId: 'cat1', sellerId: 's1', images: ['img.jpg'],
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'getProduct', 'getCategories']);

    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        provideMockActions(() => actions$),
        { provide: ProductService, useValue: productServiceSpy },
      ],
    });

    effects = TestBed.inject(ProductEffects);
  });

  it('should return loadProductsSuccess on success', () => {
    // GIVEN
    const products: Product[] = [mockProduct];
    const action = ProductActions.loadProducts({});
    const completion = ProductActions.loadProductsSuccess({ products });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getProducts.and.returnValue(cold('-b|', { b: products }));

    // WHEN / THEN
    expect(effects.loadProducts$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadProductsFailure on error', () => {
    // GIVEN
    const action = ProductActions.loadProducts({});
    const error = new Error('Network error');
    const completion = ProductActions.loadProductsFailure({ error: 'Network error' });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getProducts.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.loadProducts$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadProductSuccess on success', () => {
    // GIVEN
    const action = ProductActions.loadProduct({ id: '1' });
    const completion = ProductActions.loadProductSuccess({ product: mockProduct });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getProduct.and.returnValue(cold('-b|', { b: mockProduct }));

    // WHEN / THEN
    expect(effects.loadProduct$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadProductFailure on error', () => {
    // GIVEN
    const action = ProductActions.loadProduct({ id: '1' });
    const error = new Error('Not found');
    const completion = ProductActions.loadProductFailure({ error: 'Not found' });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getProduct.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.loadProduct$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadCategoriesSuccess on success', () => {
    // GIVEN
    const categories: Category[] = [{ id: 'c1', name: 'Electronics', parentId: null, children: [] }];
    const action = ProductActions.loadCategories();
    const completion = ProductActions.loadCategoriesSuccess({ categories });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getCategories.and.returnValue(cold('-b|', { b: categories }));

    // WHEN / THEN
    expect(effects.loadCategories$).toBeObservable(cold('--c', { c: completion }));
  });

  it('should return loadCategoriesFailure on error', () => {
    // GIVEN
    const action = ProductActions.loadCategories();
    const error = new Error('Server error');
    const completion = ProductActions.loadCategoriesFailure({ error: 'Server error' });
    actions$ = hot('-a', { a: action });
    productServiceSpy.getCategories.and.returnValue(cold('-#|', {}, error));

    // WHEN / THEN
    expect(effects.loadCategories$).toBeObservable(cold('--c', { c: completion }));
  });

});
