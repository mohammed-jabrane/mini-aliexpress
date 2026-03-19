import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminUser } from '../../../../shared/models/admin.model';
import { AdminService } from '../../services/admin.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users = signal<AdminUser[]>([]);
  loading = signal(true);
  displayedColumns = ['username', 'email', 'name', 'roles', 'status', 'actions'];

  private destroy$ = new Subject<void>();
  private adminService: AdminService;
  private notificationService: NotificationService;
  private dialog: MatDialog;

  constructor(adminService: AdminService, notificationService: NotificationService, dialog: MatDialog) {
    this.adminService = adminService;
    this.notificationService = notificationService;
    this.dialog = dialog;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: users => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.error('Failed to load users');
          this.loading.set(false);
        },
      });
  }

  toggleBan(user: AdminUser): void {
    const action = user.enabled ? 'ban' : 'unban';
    const dialogData: ConfirmDialogData = {
      title: `${action === 'ban' ? 'Ban' : 'Unban'} User`,
      message: `Are you sure you want to ${action} user "${user.username}"?`,
      confirmLabel: action === 'ban' ? 'Ban' : 'Unban',
      confirmColor: action === 'ban' ? 'warn' : 'primary',
    };

    this.dialog.open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;

        const request$ = user.enabled
          ? this.adminService.banUser(user.id)
          : this.adminService.unbanUser(user.id);

        request$.pipe(takeUntil(this.destroy$)).subscribe({
          next: updatedUser => {
            this.users.update(users =>
              users.map(u => u.id === updatedUser.id ? updatedUser : u)
            );
            this.notificationService.success(`User "${user.username}" ${action}ned successfully`);
          },
          error: () => {
            this.notificationService.error(`Failed to ${action} user`);
          },
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
