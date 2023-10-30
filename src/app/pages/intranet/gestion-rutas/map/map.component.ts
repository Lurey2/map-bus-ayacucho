import { Component, Input, OnInit } from '@angular/core';

import {
  circle,
  Control,
  control,
  FeatureGroup,
  featureGroup,
  Icon,
  icon,
  LatLng,
  latLng,
  LayerGroup,
  Map,
  marker,
  polygon,
  polyline,
  tileLayer,
} from 'leaflet';
import { MAX_ZOOM } from 'src/app/config/util.const';
import { rutasO } from 'src/app/config/rutas';
import { finalize, Subject } from 'rxjs';

import 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-polylinedecorator';
import { DataService } from 'src/app/core/data/data.service';
import { MarkerLocation } from 'src/app/core/customModel/markerLocation';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { MAPOPTION } from 'src/app/core/util/mapOption';

declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() $mapShow = new Subject<any[]>();


 //define variable
 layers: any;
 waypointsL: any[] = [];
 zones = featureGroup();
 map!: Map;
 contrl: LatLng[] = [];
 routinControl = [];
 routingArrow = [];


 drawnItems: FeatureGroup = featureGroup();
 // Define our base layers so we can reference them multiple times
 streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   detectRetina: true,
   attribution:
     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

 });
 wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
   detectRetina: true,
   attribution:
     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
 });



 // Marker for the parking lot at the base of Mt. Ranier trails

 // Path from paradise to summit - most points omitted from this example for brevity

 // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
 options = {
   layers: [this.streetMaps ],
   zoom: 17,
   center: latLng([-13.16058, -74.2268953]),
   zoomControl: false,

   //center: latLng([57.74, 11.94]),
 };

 constructor(private dataService: DataService){


 }

 ngOnInit(): void {

  this.loadRoutes();
  this.listLocations();
}

 loadRoutes() : void {
    this.dataService.loadings().show();
    this.dataService.routerWays().getAll().pipe(finalize(() => this.dataService.loadings().close())).subscribe((data : any) => {
      data.forEach(data => {
        if (data.Routes) {
          this.addRouter(data);
        }
      })
    })
 }

 listLocations(){
  this.dataService.locations().getAll().subscribe((r : any) => {
    r.forEach((location) => {

      const customIcon = L.divIcon({
        className: 'custom-icon', // Clase CSS opcional para el icono
        html: `<div style="position : relative" > <div style="position : absolute ; width:100%;height:100%;display:flex; justify-content:center;align-items:center;color:white;" ><i class="material-icons">${location.Icon}</i></div>
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="35pt" height="35pt" viewBox="0 0 916.000000 1280.000000"
        preserveAspectRatio="xMidYMid meet"><g transform="translate(-30.000000,1380.000000) scale(0.100000,-0.100000)"
        fill="${location.Color}" stroke="none">
        <path d="M4435 11769 c-529 -39 -994 -164 -1450 -390 -333 -164 -563 -319
        -850 -570 -677 -593 -1145 -1475 -1249 -2360 -9 -73 -21 -170 -26 -214 -23
        -185 -5 -611 36 -865 96 -591 311 -1125 649 -1610 28 -41 83 -124 120 -185 37
        -60 96 -155 130 -210 54 -87 287 -462 449 -725 29 -47 93 -150 143 -230 49
        -80 127 -206 173 -280 46 -74 134 -216 195 -315 61 -99 194 -313 295 -475 100
        -162 229 -369 285 -460 56 -91 203 -327 326 -525 287 -463 413 -667 589 -950
        78 -126 185 -300 238 -385 125 -203 181 -290 186 -290 2 0 25 35 51 78 26 42
        58 93 70 112 12 19 52 82 87 140 36 58 107 173 158 255 51 83 158 255 237 383
        122 198 256 415 618 997 93 149 1037 1671 1470 2370 208 336 410 657 450 715
        115 168 183 284 271 460 215 431 336 846 390 1339 19 177 16 659 -6 816 -69
        511 -206 950 -420 1345 -96 177 -110 201 -196 330 -529 795 -1342 1367 -2266
        1594 -162 40 -206 48 -408 75 -279 38 -508 48 -745 30z"/>
        </g>
        </svg> <div>`,
        iconSize: [45, 45], // Tamaño del icono
      });

      const marker = new MarkerLocation(location, { icon: customIcon , })

      marker.addTo(this.map).bindPopup(location.Name);
    });
  })
}

 resetMap(){
  this.routinControl.forEach((controlValue) => {
    this.map.removeControl(controlValue);
  });
  this.map.eachLayer( (layer) =>  {
    this.map.removeLayer(layer);
  });
  var tileLayer = this.wMaps.addTo(this.map);
  this.routinControl = [];
 }

 public onDrawStart(e: any) {
   // tslint:disable-next-line:no-console
   console.log('Draw Started Event!');
 }

 public selectMap(e: any) {
   /*
   const latS = e.latlng as LatLng;
   console.log(latS);
   this.contrl[this.contrl.length] = latS;
   console.log(this.contrl);
   const layer = marker([latS.lat, latS.lng]);
   const layer2 = marker([-13.16058, -74.2268953]);
   layer.addEventListener('click', (event: any) => {
     const latn: LatLng = event.latlng;
     //this.map.panTo(latn);
     this.map.setView(latn, MAX_ZOOM);
   });

   if (this.contrl.length > 1) {
     const ctlrAdd = L?.Routing?.control({
       waypoints: this.contrl,
       routeWhileDragging: true,
       show: true,
       addWaypoints: true,
       draggableWaypoints: false,
       fitSelectedRoutes: false,
       lineOptions: {
         styles: [{ color: '#0199FF', opacity: 1, weight: 5 }],
       }
     })?.addTo(this.map);
     this.waypointsL.push(ctlrAdd);
     console.log(this.contrl);
   } else {
   }*/
 }

 eventZoom(e: any) {
   //  console.log(e);
 }

 center(event: LatLng) {
   console.log(event);
 }

 onMapReady(event: Map) {
  this.map = event;
  this.map.addControl(L.control.zoom({ position: 'bottomleft' , zoomInText: '+' , zoomOutText: '-' , zoomInTitle :'Zoom in' , zoomOutTitle : 'Zoom out' }));

 }
 //Min Zoom 7
 //Max Zoom 18
 setEntity(entity: any[]) {
   console.log(entity);
   entity.forEach((element) => {
     const layer = marker([element.latLnG.lat, element.latLnG.lng], {
       icon: icon({
         iconSize: [element.icon.iconSize.sizeX, element.icon.iconSize.sizeY],
         iconAnchor: [
           element.icon.iconAnchor.sizeX,
           element.icon.iconAnchor.sizeY,
         ],
         iconUrl: element.icon.iconUrl,
       }),
     });

     layer.addEventListener('click', (event: any) => {
       const latn: LatLng = event.latlng;
       //this.map.panTo(latn);
       this.map.setView(latn, MAX_ZOOM);
     });

     this.drawnItems.addLayer(layer);
   });
 }

 controlClear() {
   this.waypointsL.forEach((waypoint) => console.log(waypoint.getWaypoints()));
   //this.waypointsL.forEach(waypoint => waypoint.spliceWaypoints(0, 2));
 }

 addRouter(data){
  let arrowHeadData  = [];
  if (data?.Routes?.length > 0) {
    console.log(data.routes)
    var mapLoad = this.map;
    const ctlrAdd = L?.Routing?.control({
      waypoints: data.Routes.map( (rout) => {return {lng: rout.Lng , lat : rout.Lat}}),
      routeWhileDragging: true,
      show: true,
      lineOptions: {
        styles: [{ color: data.Color, opacity: 1, weight: 5 }],
      },
      createMarker: function (i, start, n){

        return null
      } ,
      serviceUrl:`${MAPOPTION.urlOsmr}` ,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
    })?.addTo(mapLoad);
    L.DomEvent.on(ctlrAdd, 'routeselected', function(e) {
      var plan = e.route;
      var routeLine = plan.coordinates;
      const arrowHead = L.polylineDecorator(routeLine, {
        patterns: [
            {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: data.Color, fillOpacity: 1}})}
        ]
     }).addTo(mapLoad);
    });
    console.log(arrowHeadData);
    this.routingArrow.push(arrowHeadData);
    this.routinControl.push(ctlrAdd);
  }




 }
}
