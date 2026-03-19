import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserManagementComponent } from './user-management.component';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AdminUser } from '../../../../shared/models/admin.model';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockUsers: AdminUser[] = [
    { id: 'u1', username: 'alice', email: 'a@test.com', firstName: 'Alice', lastName: 'A', roles: ['ROLE_USER'], enabled: true, createdAt: '2024-01-01' },
    { id: 'u2', username: 'bob', email: 'b@test.com', firstName: 'Bob', lastName: 'B', roles: ['ROLE_USER'], enabled: false, createdAt: '2024-01-01' },
  ];

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsers', 'banUser', 'unbanUser']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    adminServiceSpy.getUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  function spyDialogOpen(returnValue: unknown): void {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(returnValue));
    spyOn(component['dialog'], 'open').and.returnValue(dialogRefSpy);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', fakeAsync(() => {
    // WHEN
    component.ngOnInit();
    tick();

    // THEN
    expect(adminServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users()).toEqual(mockUsers);
    expect(component.loading()).toBeFalse();
  }));

  it('should show error when loading users fails', fakeAsync(() => {
    // GIVEN
    adminServiceSpy.getUsers.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.loadUsers();
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to load users');
    expect(component.loading()).toBeFalse();
  }));

  it('should ban user when confirmed', fakeAsync(() => {
    // GIVEN
    const bannedUser = { ...mockUsers[0], enabled: false };
    spyDialogOpen(true);
    adminServiceSpy.banUser.and.returnValue(of(bannedUser));

    // WHEN
    component.users.set([...mockUsers]);
    component.toggleBan(mockUsers[0]);
    tick();

    // THEN
    expect(adminServiceSpy.banUser).toHaveBeenCalledWith('u1');
    expect(notificationSpy.success).toHaveBeenCalledWith('User "alice" banned successfully');
  }));

  it('should unban user when confirmed', fakeAsync(() => {
    // GIVEN
    const unbannedUser = { ...mockUsers[1], enabled: true };
    spyDialogOpen(true);
    adminServiceSpy.unbanUser.and.returnValue(of(unbannedUser));

    // WHEN
    component.users.set([...mockUsers]);
    component.toggleBan(mockUsers[1]);
    tick();

    // THEN
    expect(adminServiceSpy.unbanUser).toHaveBeenCalledWith('u2');
    expect(notificationSpy.success).toHaveBeenCalledWith('User "bob" unbanned successfully');
  }));

  it('should not ban user when dialog cancelled', fakeAsync(() => {
    // GIVEN
    spyDialogOpen(false);

    // WHEN
    component.toggleBan(mockUsers[0]);
    tick();

    // THEN
    expect(adminServiceSpy.banUser).not.toHaveBeenCalled();
  }));

  it('should show error when ban fails', fakeAsync(() => {
    // GIVEN
    spyDialogOpen(true);
    adminServiceSpy.banUser.and.returnValue(throwError(() => new Error('fail')));

    // WHEN
    component.toggleBan(mockUsers[0]);
    tick();

    // THEN
    expect(notificationSpy.error).toHaveBeenCalledWith('Failed to ban user');
  }));

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['username', 'email', 'name', 'roles', 'status', 'actions']);
  });

  it('should unsubscribe on destroy', () => {
    // GIVEN
    const destroySpy = spyOn(component['destroy$'], 'next');

    // WHEN
    component.ngOnDestroy();

    // THEN
    expect(destroySpy).toHaveBeenCalled();
  });
});
