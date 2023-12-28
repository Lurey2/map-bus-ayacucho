import { AfterViewChecked, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit  {

  title = 'prototype';
  constructor(private zone : NgZone){

  }
  ngOnInit(): void {
    /*

    declare var google: any;

    this.zone.runOutsideAngular(() => {
      google.accounts.id.initialize({
        client_id: '930343312248-5v7hdfgf2ckaalo5hffc5tq76ffvqr3p.apps.googleusercontent.com', // Reemplaza con tu ID de cliente de Google
        callback: (response: any) => {
          this.zone.run(() => {
            // Maneja la respuesta del inicio de sesión aquí
            this.login(response);
          });
        }
      });

      google.accounts.id.renderButton(this.googleButton.nativeElement, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        context: 'signin',
        ux_mode: 'popup',
        auto_prompt: false
      });
    });
*/

  }



}
