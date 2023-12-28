import { Injectable } from '@angular/core';

import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { Response } from '../model/Response';
import { User } from '../model/user';
const basePath = "user";

interface token {
  token : string;
  exp : number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
      private generic: GenericService
    ) { }

    loginSession(data : any) : Observable<Response<User>>{
       return this.generic.all(basePath).all("login").post(data);
    }

    loginAuthentication(token : string){
      return this.generic.all(basePath).all("auten").all(token).post();
    }

    singUp(data) : Observable<Response<User>> {
      return this.generic.all(basePath).all("signUp").post(data)
    }

    signUpGoogle(data) : Observable<Response<User>> {
      return this.generic.all(basePath).all("signUp").post(data)
    }

    create(data) : Observable<Response<boolean>> {
      return this.generic.all(basePath).all("create").post(data)
    }


    logout(): Observable<Response<boolean>>{
      return this.generic.all(basePath).all("logout").post();
    }

    GetUser() : Observable <Response<User>>{
      return this.generic.all(basePath).all("authentification").post()
    }

}
