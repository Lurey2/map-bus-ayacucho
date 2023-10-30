import { PointInterface } from "./Point.model";

export interface Route {
  ID? : number;
  Name : string;
  Color : String ;
  State : boolean ;
  Description : string;
  Routes? : PointInterface[];
}
