import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form : FormGroup;
  errorLogin : boolean = false;

  hide = true ;
  constructor(private dataService : DataService , private httpclient : HttpClient ,private formBuild : FormBuilder, private router : Router) {
    this.form = this.formBuild.group({
      Username : [null, Validators.required],
      Password : [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  initSession(){
    if (this.form.valid) {
      this.dataService.loadings().show();
      this.dataService.logins().loginSession(this.form.value).pipe(finalize( () => this.dataService.loadings().close()) , catchError(() => of(null)) ).subscribe((r : any) => {
          if (r !== null) {
              this.dataService.localStorages().storage( r ,'SI');
              this.router.navigate(['/intranet/gestion']);
          } else {
            this.errorLogin = true;
          }
      })
    }
  }

}
