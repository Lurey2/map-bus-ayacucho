import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { DataService } from "../data/data.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private dataService : DataService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //1) VERIFICAR SI EL USUARIO ESTA LOGUEADO
        const logeado = this.dataService.localStorages().retrieve('SESSION_STORAGE') ? true : false ;
        if (logeado) {
            this.router.navigate(['/intranet/gestion'  ]);
            return false;
        }
        return true;
    }

}
