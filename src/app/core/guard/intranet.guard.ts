import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, filter, finalize, map, tap } from 'rxjs/operators';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class IntranetGuard implements CanActivate {
  constructor(private dataService : DataService, private router: Router,private http : HttpClient){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token  = this.dataService.localStorages().retrieve('SI');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    this.dataService.loadings().show();
    return this.dataService.logins().loginAuthentication(token).pipe(
      finalize(() => this.dataService.loadings().close()),
      catchError(() =>{ this.dataService.localStorages().delete('SI');  this.router.navigate(['/login']); return of(false)}),
      map((r) => r ? true : false)
    );
  }

}
