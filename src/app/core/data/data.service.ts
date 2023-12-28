
import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';
import { LoginService } from './login.service';
import { MensajeService } from './mensaje.service';
import { NotifyService } from './notyfi.service';
import { RouteService } from './route.service';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private routerWay: RouteService,
    private loading: LoadingService,
    private notyfi: NotifyService,
    private localStorage : LocalStorageService,
    private mesajeService: MensajeService,
    private login : LoginService,
    private location: LocationService

  ) {
  }


  routerWays(): RouteService {
    return this.routerWay;
  }

  loadings(): LoadingService {
    return this.loading;
  }

  notifys() : NotifyService {
    return this.notyfi;
  }

  localStorages() : LocalStorageService{
    return this.localStorage;
  }

  messages() : MensajeService {
    return this.mesajeService;
  }

  logins() : LoginService{
    return this.login;
  }

  locations() : LocationService{
    return this.location;
  }
}
