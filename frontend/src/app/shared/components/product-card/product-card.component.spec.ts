import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 9.99,
    stock: 10,
    categoryId: 'cat-1',
    sellerId: 'seller-1',
    images: ['img1.jpg', 'img2.jpg'],
    createdAt: '2025-01-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00',
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to product detail on goToDetail()', () => {
    // WHEN
    component.goToDetail();

    // THEN
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products', '1']);
  });

  it('should stop event propagation on onAddToCart()', () => {
    // GIVEN
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);

    // WHEN
    component.onAddToCart(event);

    // THEN
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should have the product input set', () => {
    // THEN
    expect(component.product).toEqual(mockProduct);
    expect(component.product.name).toBe('Test Product');
    expect(component.product.price).toBe(9.99);
  });
});
