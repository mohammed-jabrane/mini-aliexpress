import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminService } from './admin.service';
import { AdminUser } from '../../../shared/models/admin.model';
import { Product, Category } from '../../../shared/models/product.model';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockUser: AdminUser = {
    id: 'u1', username: 'admin', email: 'admin@test.com',
    firstName: 'Admin', lastName: 'User', roles: ['ROLE_ADMIN'],
    enabled: true, createdAt: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getDashboardStats ─────────────────────────────────────

  it('should compute dashboard stats from products and categories', () => {
    // GIVEN
    const products: Product[] = [
      { id: '1', name: 'P1', description: '', price: 10, stock: 5, categoryId: 'c1', sellerId: 's1', images: [], createdAt: '', updatedAt: '' },
      { id: '2', name: 'P2', description: '', price: 20, stock: 3, categoryId: 'c1', sellerId: 's1', images: [], createdAt: '', updatedAt: '' },
    ];
    const categories: Category[] = [
      { id: 'c1', name: 'Electronics', parentId: null, children: [] },
    ];

    // WHEN
    service.getDashboardStats().subscribe(stats => {
      // THEN
      expect(stats.totalProducts).toBe(2);
      expect(stats.totalCategories).toBe(1);
      expect(stats.totalOrders).toBe(0);
      expect(stats.totalUsers).toBe(0);
    });

    const prodReq = httpMock.expectOne('/api/products');
    const catReq = httpMock.expectOne('/api/categories');
    prodReq.flush(products);
    catReq.flush(categories);
  });

  // ── getUsers ──────────────────────────────────────────────

  it('should GET users', () => {
    // WHEN
    service.getUsers().subscribe(result => {
      // THEN
      expect(result).toEqual([mockUser]);
    });

    const req = httpMock.expectOne('/api/admin/users');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  // ── banUser / unbanUser ───────────────────────────────────

  it('should PUT to ban a user', () => {
    // GIVEN
    const banned = { ...mockUser, enabled: false };

    // WHEN
    service.banUser('u1').subscribe(result => {
      // THEN
      expect(result).toEqual(banned);
    });

    const req = httpMock.expectOne('/api/admin/users/u1/ban');
    expect(req.request.method).toBe('PUT');
    req.flush(banned);
  });

  it('should PUT to unban a user', () => {
    // WHEN
    service.unbanUser('u1').subscribe(result => {
      // THEN
      expect(result).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/admin/users/u1/unban');
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  // ── createCategory ────────────────────────────────────────

  it('should POST to create a category', () => {
    // GIVEN
    const category: Category = { id: 'c2', name: 'Books', parentId: null, children: [] };

    // WHEN
    service.createCategory('Books').subscribe(result => {
      // THEN
      expect(result).toEqual(category);
    });

    const req = httpMock.expectOne('/api/categories');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Books', parentId: undefined });
    req.flush(category);
  });

  it('should POST to create a category with parentId', () => {
    // WHEN
    service.createCategory('Laptops', 'c1').subscribe();

    const req = httpMock.expectOne('/api/categories');
    expect(req.request.body).toEqual({ name: 'Laptops', parentId: 'c1' });
    req.flush({});
  });

  // ── updateCategory ────────────────────────────────────────

  it('should PUT to update a category', () => {
    // WHEN
    service.updateCategory('c1', 'Gadgets').subscribe();

    const req = httpMock.expectOne('/api/categories/c1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Gadgets', parentId: undefined });
    req.flush({});
  });

  // ── deleteCategory ────────────────────────────────────────

  it('should DELETE a category', () => {
    // WHEN
    service.deleteCategory('c1').subscribe();

    const req = httpMock.expectOne('/api/categories/c1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
