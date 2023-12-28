import { LatLng, LatLngExpression, LeafletMouseEvent, Map, Marker, MarkerOptions, Point, latLng, marker } from "leaflet";
import { PointInterface } from "../model/Point.model";
import { MAPOPTION } from "./mapOption";
import { concat } from "rxjs";

declare let L: any;

export class Graphc {

  private points : PointInterface[] = [];
  private markers : markerCustom[] = [] ;
  private routeFlow : { flow? : any , arrow? : any  }[] = []

  constructor(private map : Map){
    if (!map){
      throw new Error("mapa not found")
    }
  }

  connect(from :PointInterface , to: PointInterface){
    if( from.IndexNext > 0 && from.IndexNext){
      const index =this.routeFlow.findIndex((f) =>f.flow.index === from.Index);
      const flow = this.routeFlow[index];
      this.routeFlow = [].concat(this.routeFlow.slice(0 , index) , this.routeFlow.slice(index+ 1))
      this.map.removeControl(flow.arrow);
      this.map.removeControl(flow.flow);
    }

    this.routeFlow.forEach((flow) => console.log("flow", flow))

    let routerList : LatLng[] = [latLng(from.Lat, from.Lng) , latLng(to.Lat, to.Lng) ];

    const ctlrAdd = this.createRoute(routerList, from);
    ctlrAdd.index = from.Index;
    ctlrAdd.IndexNext = to.Index;

    Promise.all([this.createArrow(ctlrAdd) , this.getDistanceOsmrv(routerList)]).then(([arrow , distance]) => {
      this.routeFlow.push({arrow : arrow, flow : ctlrAdd});
      from.Distance = distance;
      from.IndexNext = to.Index;
    })
  }

  connectEdit(from :PointInterface , to: PointInterface){
    let routerList : LatLng[] = [latLng(from.Lat, from.Lng) , latLng(to.Lat, to.Lng) ];
    const ctlrAdd = this.createRoute(routerList , from);
    ctlrAdd.index = from.Index;
    ctlrAdd.IndexNext = to.Index;

    this.createArrow(ctlrAdd).then((arrow)=> {
      this.routeFlow.push({arrow : arrow , flow : ctlrAdd});
    });
  }

  public insertPoint(latLng : LatLng) : Marker{
    const point = {
      Lat : latLng.lat,
      Lng : latLng .lng,
      Index : this.getIndexLast(),
      Show : true
    };
    this.points.push(point)
    const marker = new markerCustom({lat : latLng.lat , lng : latLng.lng } , point);
    this.markers.push(marker);
    marker.addTo(this.map)

    return marker;
  }

  public delete(data : PointInterface){
    const indexPoint = this.points.findIndex((f) => f.Index === data.Index);
    const indexMarker = this.markers.findIndex((f) => f.data.Index === data.Index);

    const point = this.points[indexPoint];
    const marker = this.markers[indexMarker];

    this.map.removeLayer(marker);

    if( point.IndexNext &&  point.IndexNext > 0){
      const index =this.routeFlow.findIndex((f) =>f.flow.index === data.Index);
      const flow = this.routeFlow[index];
      console.log(flow);
      this.routeFlow = [].concat(this.routeFlow.slice(0 , index) , this.routeFlow.slice(index+ 1))
      this.map.removeControl(flow.arrow);
      this.map.removeControl(flow.flow);
    }
    console.log(this.routeFlow)
    console.log(data.Index)
    const indexFlow = this.routeFlow.findIndex((f) => f.flow.IndexNext === data.Index );
    console.log(indexFlow)
    if ( indexFlow >= 0 ){

      const flowBack = this.routeFlow[indexFlow];
      const markerback = this.points.find((f) => f.Index === flowBack.flow.index);
      markerback.IndexNext = 0;
      markerback.Distance = 0;

      this.routeFlow = [].concat(this.routeFlow.slice(0 , indexFlow) , this.routeFlow.slice(indexFlow+ 1))
      this.map.removeControl(flowBack.arrow);
      this.map.removeControl(flowBack.flow);
    }


    this.markers = [].concat(this.markers.slice(0 , indexMarker) , this.markers.slice(indexMarker +1 ));
    this.points = [].concat(this.points.slice(0, indexPoint) , this.points.slice(indexPoint +1 ));

  }

  private getIndexLast() : number{
    if (this.points.length === 0){
      return 1
    }
    const indexMax = this.points.reduce( (prev : number , current : PointInterface ) =>  {
      if (prev < current.Index){
        return current.Index
      }
      return prev
    } , 0);

    return indexMax + 1 ;
  }

  public getDataPoint() : PointInterface[]{
    return this.points;
  }


  public setPoints(points : PointInterface[]) : void{
    this.points = points;
    this.points.forEach((point) => {
      const marker = new markerCustom({lat : point.Lat , lng : point.Lng} , point)
      this.markers.push(marker);
      marker.addTo(this.map);
      if(point.Distance > 0){
        const nextInterface : PointInterface = this.points.find((p) => p.Index === point.IndexNext);
        this.connectEdit(point , nextInterface);
      }
    })
  }

  public addEventMarker(typeEvent : string , fn : eventListener ){
    this.markers.forEach((marker) => {
      marker.addEventListener(typeEvent , fn );
    })
  }

  private createRoute(latlngs : LatLng[]  , DataFrom : PointInterface  , fn?  :eventListener){
    const ctlrAdd = L?.Routing?.control({
      waypoints: latlngs,
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
          l.on('click', (e : LeafletMouseEvent) => {
            var popup = L.popup();
            popup
            .setLatLng(e.latlng) // Sets the geographical point where the popup will open.
            .setContent("Distancia :<br> " +  DataFrom.Distance + " m") // Sets the HTML content of the popup.
            .openOn(this.map);
          } );
        });
        return line;
      }
      ,
      serviceUrl: MAPOPTION.urlOsmr,

      lineOptions: {
        styles: [{ color: "black", opacity: 1, weight: 5 }],
      }
    })?.addTo(this.map);

    return ctlrAdd;
  }

  private createArrow(ctrl : any) {
    return new Promise<any>((resolve) => {
      L.DomEvent.on(ctrl, 'routeselected', (e) => {
        var plan = e.route;
        var routeLine = plan.coordinates;

        const arrowDecorator = L.polylineDecorator(routeLine, {
          patterns: [
              {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: "black", fillOpacity: 1}})}
          ]
        }).addTo(this.map);
        resolve(arrowDecorator);
        //this.routeFlow.push({flow : ctlrAdd , arrow : arrowDecorator})

      })
    })
  }

  private getDistanceOsmrv(latLngs : LatLng[]){
    return new Promise<any>((resolve) => {
      console.log(latLngs)
      const dataRouter = [
        ...latLngs.map((m) => L.Routing.waypoint({lat : m.lat , lng : m.lng}) )
      ]
      L.Routing.osrmv1({serviceUrl : MAPOPTION.urlOsmr}).route(dataRouter, (err, routes) => {
        if(routes !== undefined){
          resolve( routes[0].summary.totalDistance)

        }
      });
    })
  }
}

export class markerCustom extends Marker {

  constructor(public latlng : LatLngExpression , public data : PointInterface , option?:  MarkerOptions  ){
    super(latlng , option);
  }


}

type eventListener = (event : any) => void;
