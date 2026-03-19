import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product, Category } from '../../../shared/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: '1', name: 'Laptop', description: 'A laptop', price: 999,
    stock: 10, categoryId: 'cat1', sellerId: 's1', images: ['img.jpg'],
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getProducts ───────────────────────────────────────────

  it('should fetch products without params', () => {
    // GIVEN
    const products: Product[] = [mockProduct];

    // WHEN
    service.getProducts().subscribe(result => {
      // THEN
      expect(result).toEqual(products);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(products);
  });

  it('should fetch products with query param', () => {
    // WHEN
    service.getProducts('laptop').subscribe();

    // THEN
    const req = httpMock.expectOne(r => r.url === '/api/products');
    expect(req.request.params.get('q')).toBe('laptop');
    req.flush([]);
  });

  it('should fetch products with categoryId param', () => {
    // WHEN
    service.getProducts(undefined, 'cat1').subscribe();

    // THEN
    const req = httpMock.expectOne(r => r.url === '/api/products');
    expect(req.request.params.get('categoryId')).toBe('cat1');
    expect(req.request.params.has('q')).toBeFalse();
    req.flush([]);
  });

  it('should fetch products with both query and categoryId', () => {
    // WHEN
    service.getProducts('laptop', 'cat1').subscribe();

    // THEN
    const req = httpMock.expectOne(r => r.url === '/api/products');
    expect(req.request.params.get('q')).toBe('laptop');
    expect(req.request.params.get('categoryId')).toBe('cat1');
    req.flush([]);
  });

  // ── getProduct ────────────────────────────────────────────

  it('should fetch a single product by id', () => {
    // WHEN
    service.getProduct('1').subscribe(result => {
      // THEN
      expect(result).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  // ── getCategories ─────────────────────────────────────────

  it('should fetch categories', () => {
    // GIVEN
    const categories: Category[] = [{ id: 'c1', name: 'Electronics', parentId: null, children: [] }];

    // WHEN
    service.getCategories().subscribe(result => {
      // THEN
      expect(result).toEqual(categories);
    });

    const req = httpMock.expectOne('/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush(categories);
  });
});
