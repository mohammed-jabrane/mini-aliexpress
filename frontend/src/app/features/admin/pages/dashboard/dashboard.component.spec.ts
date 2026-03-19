import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DashboardStats } from '../../../../shared/models/admin.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockStats: DashboardStats = {
    totalProducts: 10, totalCategories: 3, totalOrders: 0, totalUsers: 0,
  };

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getDashboardStats']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    adminServiceSpy.getDashboardStats.and.returnValue(of(mockStats));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', fakeAsync(() => {
    // WHEN
    component.ngOnInit();
    tick();

    // THEN
    expect(adminServiceSpy.getDashboardStats).toHaveBeenCalled();
    expect(component.stats()).toEqual(mockStats);
    expect(component.loading()).toBeFalse();
  }));

  it('should show error notification on failure', fakeAsync(() => {
    // GIVEN
    adminServiceSpy.getDashboardStats.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.ngOnInit();
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to load dashboard stats');
    expect(component.loading()).toBeFalse();
    expect(component.stats()).toBeNull();
  }));

  it('should unsubscribe on destroy', () => {
    // GIVEN
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    // WHEN
    component.ngOnDestroy();

    // THEN
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
