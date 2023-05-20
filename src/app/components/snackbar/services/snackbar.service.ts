import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBars: {
    message: string;
    action: string;
    duration: number;
  }[] = [];

  constructor(private snackBar: MatSnackBar) {}

  open(
    message: string,
    action: string = 'Закрыть',
    duration: number = 150000
  ): void {
    this.snackBars.push({
      message,
      action,
      duration,
    });

    this.snackBars.forEach((snackBar) => {
      this.snackBar.open(snackBar.message, snackBar.action, {
        duration: snackBar.duration,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    })
  }

  // this.snackBar.open(message, action, { duration, horizontalPosition: 'right', verticalPosition: 'top' })

  dismissAll(): void {
    this.snackBars = [];
  }
}
