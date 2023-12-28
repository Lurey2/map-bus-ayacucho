import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs';
import { STORAGEKEY } from 'src/app/config/auth.config';
import { DataService } from 'src/app/core/data/data.service';
import { Status } from 'src/app/core/model/Response';
declare var google: any;

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class RegisterUserComponent implements OnInit   {

  @ViewChild('googleButton', { static: true }) googleButton: ElementRef;

  load = false;
  form: FormGroup ;
  error :  {[key : string ] : string } = {};

  constructor(private NgZone : NgZone, private dataService :DataService,private formbuilder : FormBuilder  , private router: Router){}


  ngOnInit(): void {
    this.initForm();
    this.initGoogle();



  }

  initForm(){
    this.form = this.formbuilder.group({
      Username : [null ,{ validators:[ Validators.required]}],
      Email : [null, { validators:[ Validators.required, Validators.email]}],
      Password : [null, { validators:[ Validators.required]}],
      Passwordtemp : [null,  { validators:[ Validators.required]}],
      },
      {
        validators : [ValidatorPassword("Password" , "Passwordtemp")]
      }
    )

  }

  get f(): {[key: string ] : AbstractControl}{
    return this.form.controls;
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
        text: 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        context: 'signin',
        ux_mode: 'popup',
        auto_prompt: false
      });
    });
  }

  SingUpGoogle(response){
    this.dataService.logins().signUpGoogle(response).subscribe((r) => {

      if (r.status === Status.OK){
        this.dataService.localStorages().storage( r.data  , STORAGEKEY )
        this.router.navigate(["/map"])
      }
    })

  }

  SignUp(){
    this.load = true ;
    this.dataService.logins().create(this.form.value).pipe(finalize(() =>this.load = false)).subscribe((r) => {
        if(r.status === Status.OK){
          this.router.navigate(["/login-user"]);
        }else  {
          this.error[r.error.type] = r.error.message;
          this.form.patchValue({
            Password : '',
            Passwordtemp : ''
          })
        }
    })
  }



}


function ValidatorPassword(Password , Passwordtemp) : ValidatorFn {
  return (control :AbstractControl)  => {

    const password = control.get(Password);
    const replicatePassword = control.get(Passwordtemp)

    if(password.value !== replicatePassword.value){
      replicatePassword.setErrors({ error : "Las contraseñas no coinciden"})
    }

    return password.value !== replicatePassword.value ? { error: "contraseña" } : null;
  };

}
