import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../shared/models/product.model';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProduct: Product = {
    id: 'p1',
    name: 'Test Product',
    description: 'A great product',
    price: 49.99,
    stock: 15,
    categoryId: 'c1',
    sellerId: 's1',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    createdAt: '2025-01-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00',
  };

  function createComponent(paramId: string | null): void {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: { paramMap: { get: () => paramId } },
      },
    });

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'p1' } },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent('p1');
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    // GIVEN
    createComponent('p1');

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith('p1');
    expect(component.product()).toEqual(mockProduct);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeFalse();
  });

  it('should set error when route id is missing', () => {
    // GIVEN
    createComponent(null);

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(productServiceSpy.getProduct).not.toHaveBeenCalled();
    expect(component.error()).toBeTrue();
    expect(component.loading()).toBeFalse();
  });

  it('should set error on service failure', () => {
    // GIVEN
    productServiceSpy.getProduct.and.returnValue(throwError(() => new Error('Not found')));
    createComponent('p1');

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(component.error()).toBeTrue();
    expect(component.loading()).toBeFalse();
    expect(component.product()).toBeNull();
  });

  it('should select image by index', () => {
    // GIVEN
    createComponent('p1');
    fixture.detectChanges();

    // WHEN
    component.selectImage(2);

    // THEN
    expect(component.selectedImageIndex()).toBe(2);
    expect(component.selectedImage()).toBe('img3.jpg');
  });

  it('should return first image as selected by default', () => {
    // GIVEN
    createComponent('p1');

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(component.selectedImageIndex()).toBe(0);
    expect(component.selectedImage()).toBe('img1.jpg');
  });

  it('should return placeholder when product has no images', () => {
    // GIVEN
    productServiceSpy.getProduct.and.returnValue(of({ ...mockProduct, images: [] }));
    createComponent('p1');

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(component.selectedImage()).toBe('https://placehold.co/600x600?text=No+Image');
  });

  it('should return placeholder when product is null', () => {
    // GIVEN
    createComponent(null);

    // WHEN
    fixture.detectChanges();

    // THEN
    expect(component.selectedImage()).toBe('https://placehold.co/600x600?text=No+Image');
  });
});
