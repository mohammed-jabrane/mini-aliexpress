import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification with default duration', () => {
    service.success('Operation successful');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Operation successful', 'Close', jasmine.objectContaining({
      duration: 4000,
      panelClass: 'snackbar-success',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    }));
  });

  it('should show error notification with default duration', () => {
    service.error('Something went wrong');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Something went wrong', 'Close', jasmine.objectContaining({
      duration: 6000,
      panelClass: 'snackbar-error',
    }));
  });

  it('should show info notification with default duration', () => {
    service.info('Information');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Information', 'Close', jasmine.objectContaining({
      duration: 4000,
      panelClass: 'snackbar-info',
    }));
  });

  it('should show warn notification with default duration', () => {
    service.warn('Warning');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Warning', 'Close', jasmine.objectContaining({
      duration: 5000,
      panelClass: 'snackbar-warn',
    }));
  });

  it('should allow custom duration', () => {
    service.success('Quick message', 2000);

    expect(snackBarSpy.open).toHaveBeenCalledWith('Quick message', 'Close', jasmine.objectContaining({
      duration: 2000,
    }));
  });
});
