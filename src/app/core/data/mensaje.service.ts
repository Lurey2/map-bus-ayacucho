import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, duration: number = 1000) {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
    });
  }
}
