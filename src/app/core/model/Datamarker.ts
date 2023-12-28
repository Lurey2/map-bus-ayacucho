import { MAPOPTION } from "../util/mapOption";
import { NodeIndex } from "./nodeIndex";

declare let L: any;

export class DataMarker extends L.Marker {
  data: NodeIndex;
  node : DataMarker;
  latLng : L.LatLngExpression;
  mapL : L.Map;
  maker  : any;
  Route : any ;
  arrow : any ;
  color : any;

  constructor(latLng: L.LatLngExpression, data: NodeIndex,  map : L.Map , options?: L.MarkerOptions) {
    super(latLng, options);
    this.setData(data);
    this.setlatLng(latLng);
    this.maker = this.addTo(map);

    this.setMap(map);
  }

  setMap(map: L.Map){
    this.mapL = map;
  }

  getData() {
    return this.data;
  }

  setData(data: NodeIndex) {
    this.data = data;
  }

  setlatLng(latLng: L.LatLngExpression){
    this.latLng = latLng;
  }

  destroy(){
    this.desconectNode();
    this.mapL.removeLayer(this.maker);
  }

  conectNode(node : DataMarker , color : string){
    this.desconectNode();
    this.createRoute(node , color );
  }

  desconectNode(){

    this.nodee = undefined;
    this.color = undefined;
    if (this.Route && this.arrow ) {

      this.mapL.removeControl(this.Route);
      this.mapL.removeControl(this.arrow);
      this.data.IndexNext = null ;
    }

  }

  getLatLng(): L.LatLngExpression {
    return this.latLng;
  }
  createRoute(toNode : DataMarker , color : string){
    let routerList = [this.latLng , toNode.latLng];
    let distanc = 0;
    this.data.IndexNext = toNode.data.Index;
    var mapLoad = this.mapL;

    const ctlrAdd = L?.Routing?.control({
      waypoints: routerList,
      routeWhileDragging: true,
      show: false,
      addWaypoints: true,
      draggableWaypoints: true,
      fitSelectedRoutes: false,
      createMarker: function (i, start, n){

        return null
      },
      routeLine:  (route, options) => {
        var line = L.Routing.line(route, options);
        line.eachLayer( (l) => {
          l.on('click', (e) => {console.log(this.data)} );
        });
        return line;
      }
      ,
      serviceUrl: MAPOPTION.urlOsmr,

      lineOptions: {
        styles: [{ color: color, opacity: 1, weight: 5 }],
      }
    })?.addTo(this.mapL);

    L.DomEvent.on(ctlrAdd, 'routeselected', (e) => {
      var plan = e.route;
      var routeLine = plan.coordinates;

      this.arrow =  L.polylineDecorator(routeLine, {
        patterns: [
            {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: color, fillOpacity: 1}})}
        ]
     }).addTo(mapLoad);

    });

    const dataRouter = [L.Routing.waypoint({lat : this.data.Lat , lng : this.data.Lng}) , L.Routing.waypoint({ lat : toNode.data.Lat , lng : toNode.data.Lng})  ]

    L.Routing.osrmv1({serviceUrl : MAPOPTION.urlOsmr}).route(dataRouter, (err, routes) => {
      if(routes !== undefined){
        this.data.Distance = routes[0].summary.totalDistance;
        distanc = routes[0].summary.totalDistance;
      }
    });




    this.Route = ctlrAdd;

    /*
    const initialLtn  = this.lat
    L?.Routing?.control({
      waypoints: [],
      routeWhileDragging: true,
      show: true,
      addWaypoints: true,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      lineOptions: {
        styles: [{ color: '#0199FF', opacity: 1, weight: 5 }],
      }
    })?.addTo(this.map);
    */
  }


}
