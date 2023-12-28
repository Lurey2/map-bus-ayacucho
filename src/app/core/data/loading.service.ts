import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private spinner: NgxSpinnerService) { }

  show(){
    this.spinner.show(undefined, {
      type: 'ball-clip-rotate-pulse',
      size: 'default',
      bdColor: 'rgba(0,0,0,0.8)',
      color: '#9cdcfe',
      fullScreen: true,
    })
  }

  close(){
    this.spinner.hide();
  }
}
