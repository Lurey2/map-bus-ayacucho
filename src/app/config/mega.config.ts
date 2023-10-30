import { Injectable } from "@angular/core";
import { HOST, MICRO } from "./auth.config";

@Injectable()
export class Configuration {
  
  public api = `${HOST}${MICRO}`;

}