import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
const basePath = "location";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private generic: GenericService,
    private localStorage: LocalStorageService
  ) { }

  getAll() {
    return this.generic.all(basePath).get();
  }


  getById(id: string) {
    return this.generic.one(basePath, id).get();
  }

  create(data: any) {
    return this.generic.all(basePath).all("create").post(data);
  }

  update(data: any): Observable<any> {
    return this.generic.all(basePath).all("update").put(data);
  }

  delete(id: any): Observable<any> {
    return this.generic.all(basePath).one("delete", id).delete();
  }
}
