import { Component, ViewEncapsulation } from '@angular/core';
import { Map, latLng, tileLayer } from 'leaflet';

import 'leaflet';
import 'leaflet-routing-machine';
import { DataService } from 'src/app/core/data/data.service';

declare let L: any;

import 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-polylinedecorator';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MaterialModule } from 'src/app/material/material.module';
import { Route } from 'src/app/core/model/route';

@Component({
  selector: 'app-home-intranet',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './home-intranet.component.html',
  styleUrls: ['./home-intranet.component.scss'],
  imports: [LeafletModule, MaterialModule],
  standalone : true
})
export class HomeIntranetComponent {
  map!: Map;
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  options = {
    layers: [this.streetMaps],
    zoom: 17,
    center: latLng([-13.16058, -74.2268953]),
    zoomControl: false,
  };

  constructor(private dataService: DataService){}

 onMapReady(event: Map) {
  this.map = event;
  this.loadRoute();
  this.map.addControl(L.control.zoom({ position: 'bottomleft' , zoomInText: '+' , zoomOutText: '-' , zoomInTitle :'Zoom in' , zoomOutTitle : 'Zoom out' }));
 }


 loadRoute() {
  this.dataService
    .routerWays()
    .findWithPointByUser()
    .subscribe((response) => {

      this.insertNearRoute(response.data.slice().reverse());
    });
  }

  insertNearRoute(route : any[]){

    route.forEach((item , index) => {
      const routeGenerate = this.generateRoute(item);

      routeGenerate.addTo(this.map);

    });
    /*this.controlClear();
    route.forEach((item , index) => {
      setTimeout(() => {
        this.addRouter(item , index);
      }, 300);

      if (this.viewRoute && this.formRoute.valid) {
        const pointInitial = this.findRouteId(item.ID);
        const pointEnd = this.findRouteId(item.ID);
        this.arrowHead(this.formRoute.value.origin  , new LatLng(pointInitial.PointInitial.Lat,pointInitial.PointInitial.Lng) , 'red');
        this.arrowHead( new LatLng(pointEnd.PointEnd.Lat,pointEnd.PointEnd.Lng) , this.formRoute.value.destiny  , 'blue');


      }

    });*/
  }

  generateRoute(data  : Route ){
    console.log(data)
    if (data?.Routes?.length > 0) {
      const coordinates = data.Routes.map((rout) => {
        return { lng: rout.Lng, lat: rout.Lat };
      });
      const route = L?.Routing?.control({
        waypoints: coordinates,
        routeWhileDragging: true,
        show: true,
        serviceUrl: 'http://54.196.14.202:5000/route/v1',
        lineOptions: {
          styles: [{ color: data.Color, opacity: 1, weight: 4 }],
        },/*
        createMarker: function (i, start, n){

          return null
        },*/
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        createMarker: function (i, start, n){

          return null
        },
        routeLine:  (routeL, options) => {
          var line = L.Routing.line(routeL, options);
          line.eachLayer( (l) =>  {
            l.on('click', (e) =>  {

            });
          });
          return line;
        },
      });

      this.generateArrow(route, data);

      return route;
    }
  }

  generateArrow(route,data){
    return new Promise((resolve) => {
      L.DomEvent.on(route, 'routeselected', (e) => {
        var plan = e.route;
        var routeLine = plan.coordinates;

        const controlArrow = L.polylineDecorator(routeLine, {
          patterns: [
            {
              offset: 25,
              repeat: 50,
              symbol: L.Symbol.arrowHead({
                pixelSize: 15,
                pathOptions: { color: data.Color, fillOpacity: 1 },
              }),
            },
          ],
        }).addTo(this.map);;

        resolve(controlArrow);
      });
    });
  }
}
