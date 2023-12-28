import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  succes(message : string){
    swal.fire({
      title: 'Guardado Correctamente',
      icon: 'success'
    }
    )
  }
}
