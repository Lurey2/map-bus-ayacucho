import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorageConfig : Storage;

  constructor() {
    this.localStorageConfig = localStorage;
  }

  retrieve(key : string){
    const data =  this.localStorageConfig.getItem(key);
    let response = null;
    if (data) {
      response = JSON.parse(data);
    }
    return response;
  }

  delete(key : string){
    this.localStorageConfig.removeItem(key);
  }


  storage(data : any , key : string){
    const dataStorage = JSON.stringify(data);
    this.localStorageConfig.setItem(key , dataStorage);
  }

}
