import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';
import { HttpClient } from '@angular/common/http';
import { Status } from 'src/app/core/model/Response';
import { STORAGEKEY } from 'src/app/config/auth.config';
declare var google: any;

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent {
  @ViewChild('googleButton', { static: true }) googleButton: ElementRef;
  form : FormGroup;
  errorLogin : boolean = false;

  hide = true ;



  constructor(private dataService : DataService , private NgZone : NgZone ,private formBuild : FormBuilder, private router : Router) {
    this.form = this.formBuild.group({
      Username : [null, Validators.required],
      Password : [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initGoogle();
  }


initGoogle(){
  this.NgZone.runOutsideAngular(() => {
      google.accounts.id.initialize({
        client_id: '930343312248-5v7hdfgf2ckaalo5hffc5tq76ffvqr3p.apps.googleusercontent.com', // Reemplaza con tu ID de cliente de Google
        callback: (response: any) => {
          this.NgZone.run(() => {
            // Maneja la respuesta del inicio de sesión aquí
            this.SingUpGoogle(response);
          });
        }
      });

      google.accounts.id.renderButton(this.googleButton.nativeElement, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'login_with',  // Cambiado de 'signup_with' a 'login_with'
        shape: 'rectangular',
        logo_alignment: 'left',
        context: 'signin',
        ux_mode: 'popup',
        auto_prompt: false
      });
    });
  }


  initSession(){
    if (this.form.valid) {
      this.dataService.loadings().show();
      this.dataService.logins().loginSession(this.form.value).pipe(finalize( () => this.dataService.loadings().close()) , catchError(() => of(null)) ).subscribe((r ) => {
        if (r.status === Status.OK){
          this.dataService.localStorages().storage( r.data  , STORAGEKEY )
          this.router.navigate(["/map"])
        } else {
          this.errorLogin = true ;
        }
      })
    }
  }

  SingUpGoogle(response){
    this.dataService.logins().signUpGoogle(response).subscribe((r) => {

      if (r.status === Status.OK){
        this.dataService.localStorages().storage( r.data  , STORAGEKEY )
        this.router.navigate(["/map"])
      }
    })

  }
}
