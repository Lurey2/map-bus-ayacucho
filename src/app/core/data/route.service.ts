import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
import { Route } from '../model/route';
import { Response } from '../model/Response';
const basePath = "route";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
constructor(
    private generic: GenericService,
    private localStorage: LocalStorageService
  ) { }

  getAll(): Observable<Route[]>{
    return this.generic.all(basePath).get().pipe(map((res: any) => {

      return res;
    }));
  }

  getActivos() : Observable<Route[]>  {
    return this.generic.all(basePath).all("getActive").get().pipe(map((res: any) => {
      const listStorage = this.localStorage
          .retrieve('orderPath');
      if (!listStorage) {
        return res;
      }

      return res.sort((a,b) => {
        const indexA = listStorage.findIndex((f) => f.ID === a.ID)
        const indexB = listStorage.findIndex((f) => f.ID === b.ID)
        return (indexA - indexB)
      })
    }));
  }

  getById(id: string)  {
    return this.generic.one(basePath, id).get<Route>();
  }

  create(data: any) {
    return this.generic.all(basePath).all("create").post<Route>(data);
  }

  update(data: any): Observable<any> {
    return this.generic.all(basePath).all("update").put<Route>(data);
  }

  delete(id: any): Observable<any> {
    return this.generic.all(basePath).one("delete", id).delete();
  }

  nearbyRoute(origin: LatLng , finish : LatLng ){
    const content = {
      CoordInitialLat : origin.lat,
      CoordInitialLng : origin.lng,
      CoordEndLat :  finish.lat,
      CoordEndLng : finish.lng
    }
    return this.generic.all(basePath).all("nearbyRoute").post(content);
  }


  searchRouteNearby(origin: LatLng  ){
    const content = {
      CoordInitialLat : origin.lat,
      CoordInitialLng : origin.lng
    }
    return this.generic.all(basePath).all("nearbyRouteLtnLng").post(content);
  }


  FindByIdUser() : Observable<Response<Route[]>>{
    return this.generic.all(basePath).all("getRouteUser").post()
  }

  findWithPointByUser()  : Observable<Response<Route[]>>{
    return this.generic.all(basePath).all("getRoutePointUser").post()
  }

}
