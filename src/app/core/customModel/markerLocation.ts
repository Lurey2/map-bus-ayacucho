import { Marker, MarkerOptions } from "leaflet";
import { LocationC } from "../model/Location";

export class MarkerLocation extends Marker {

  data : LocationC;

  constructor(location : LocationC , option :MarkerOptions ){
    super([location.Lat , location.Lng] , option);
    this.data = location;
  }

}
