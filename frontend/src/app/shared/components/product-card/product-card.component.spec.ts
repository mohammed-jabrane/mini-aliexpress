import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      id: '1',
      name: 'Test Product',
      description: 'Test description',
      price: 9.99,
      stock: 10,
      categoryId: 'cat-1',
      sellerId: 'seller-1',
      images: [],
      createdAt: '2025-01-01T00:00:00',
      updatedAt: '2025-01-01T00:00:00',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
