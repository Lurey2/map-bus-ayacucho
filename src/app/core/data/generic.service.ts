import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from "rxjs/operators";
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Configuration } from 'src/app/config/mega.config';


@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private url: string;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private configuration: Configuration
  ) {
    this.url = configuration.api;
   }

   get http() {
    return this._http;
  }
  /***************************************************************************************************
   *
   * Servicios Genericos BASE PATH.
   *
   ***************************************************************************************************/
  get path() {
    return this.url;
  }

  one(path: string, id: string): GenericService {
    const restangular = this.clone();
    restangular.url += (path ? "/" + path : "") + "/" + id;
    return restangular;
  }

  all(path: string) {
    const restangular = this.clone();
    restangular.url = restangular.url + "/" + path;
    return restangular;
  }

  get<T>(queryParams?: HttpParams): Observable<T> {
    return this._http.get(this.url, { params: queryParams }).pipe(
      map((response) => {
        return response as any;
      })
    );
  }

  post<T>(obj?: any): Observable<T> {

    return this._http.post(this.url, obj  , {withCredentials : true} ).pipe(
      catchError((e) =>  of(e.error)),
      map((response) => {
        return response as any;
      })
    );
  }

  put<T>(obj: any): Observable<T> {
    const clone = Object.assign({}, obj);
    delete clone["_restangular"];
    return this._http.put(this.url, clone , {withCredentials : true}).pipe(
      map((response) => {
        return response as any;
      })
    );
  }

  delete<T>(): Observable<T> {
    return this._http.delete(this.url, {withCredentials : true}).pipe(
      map((response) => {
        return response as any;
      })
    );
  }


  /***************************************************************************************************
   *
   * Seccion de errores y reinyeccion de servicio.
   *
   ***************************************************************************************************/

  clone(): GenericService {
    return new GenericService(this._http, this.router, { api : this.url});
  }


}
