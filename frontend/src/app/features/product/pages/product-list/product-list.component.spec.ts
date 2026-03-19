import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../../../shared/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;

  const mockProducts: Product[] = [
    {
      id: '1', name: 'Alpha', description: 'desc', price: 30,
      stock: 5, categoryId: 'c1', sellerId: 's1', images: [],
      createdAt: '2025-01-01T00:00:00', updatedAt: '2025-01-01T00:00:00',
    },
    {
      id: '2', name: 'Beta', description: 'desc', price: 10,
      stock: 3, categoryId: 'c2', sellerId: 's1', images: [],
      createdAt: '2025-02-01T00:00:00', updatedAt: '2025-02-01T00:00:00',
    },
    {
      id: '3', name: 'Gamma', description: 'desc', price: 20,
      stock: 8, categoryId: 'c1', sellerId: 's2', images: [],
      createdAt: '2025-03-01T00:00:00', updatedAt: '2025-03-01T00:00:00',
    },
  ];

  const mockCategories: Category[] = [
    { id: 'c1', name: 'Electronics', parentId: null, children: [] },
    { id: 'c2', name: 'Books', parentId: null, children: [] },
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'getCategories']);
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productServiceSpy.getCategories.and.returnValue(of(mockCategories));
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and categories on init', () => {
    // WHEN
    fixture.detectChanges();

    // THEN
    expect(productServiceSpy.getCategories).toHaveBeenCalled();
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(mockProducts);
    expect(component.categories()).toEqual(mockCategories);
    expect(component.loading()).toBeFalse();
  });

  it('should pass query param to getProducts', () => {
    // GIVEN
    queryParamsSubject.next({ q: 'laptop' });

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(productServiceSpy.getProducts).toHaveBeenCalledWith('laptop', undefined);
    expect(component.searchQuery()).toBe('laptop');
  });

  it('should sort products by price ascending', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    component.onSortChange('price-asc');

    // THEN
    const sorted = component.sortedProducts();
    expect(sorted[0].price).toBe(10);
    expect(sorted[1].price).toBe(20);
    expect(sorted[2].price).toBe(30);
  });

  it('should sort products by price descending', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    component.onSortChange('price-desc');

    // THEN
    const sorted = component.sortedProducts();
    expect(sorted[0].price).toBe(30);
    expect(sorted[1].price).toBe(20);
    expect(sorted[2].price).toBe(10);
  });

  it('should sort products by name', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    component.onSortChange('name');

    // THEN
    const sorted = component.sortedProducts();
    expect(sorted[0].name).toBe('Alpha');
    expect(sorted[1].name).toBe('Beta');
    expect(sorted[2].name).toBe('Gamma');
  });

  it('should sort products by newest by default', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    const sorted = component.sortedProducts();

    // THEN (newest first — Gamma > Beta > Alpha)
    expect(sorted[0].name).toBe('Gamma');
    expect(sorted[1].name).toBe('Beta');
    expect(sorted[2].name).toBe('Alpha');
  });

  it('should filter by category when onCategoryChange is called', () => {
    // GIVEN
    fixture.detectChanges();
    productServiceSpy.getProducts.calls.reset();

    // WHEN
    component.onCategoryChange('c1');

    // THEN
    expect(component.selectedCategoryId()).toBe('c1');
    expect(productServiceSpy.getProducts).toHaveBeenCalledWith(undefined, 'c1');
  });

  it('should clear category filter when null is passed', () => {
    // GIVEN
    fixture.detectChanges();
    component.onCategoryChange('c1');
    productServiceSpy.getProducts.calls.reset();

    // WHEN
    component.onCategoryChange(null);

    // THEN
    expect(component.selectedCategoryId()).toBeNull();
    expect(productServiceSpy.getProducts).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should handle product loading error', () => {
    // GIVEN
    productServiceSpy.getProducts.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(component.products()).toEqual([]);
    expect(component.loading()).toBeFalse();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    // GIVEN
    fixture.detectChanges();
    const destroySpy = spyOn(component['destroy$'], 'complete');

    // WHEN
    component.ngOnDestroy();

    // THEN
    expect(destroySpy).toHaveBeenCalled();
  });
});
