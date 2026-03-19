import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 4000): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration,
      panelClass: 'snackbar-success',
    });
  }

  error(message: string, duration = 6000): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration,
      panelClass: 'snackbar-error',
    });
  }

  info(message: string, duration = 4000): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration,
      panelClass: 'snackbar-info',
    });
  }

  warn(message: string, duration = 5000): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration,
      panelClass: 'snackbar-warn',
    });
  }
}
