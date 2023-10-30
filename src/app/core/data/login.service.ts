import { Injectable } from '@angular/core';

import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
const basePath = "user";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
      private generic: GenericService
    ) { }

    loginSession(data : any){
       return this.generic.all(basePath).all("login").post(data);
    }

    loginAuthentication(token : string){
      return this.generic.all(basePath).all("auten").all(token).post();
    }

}
