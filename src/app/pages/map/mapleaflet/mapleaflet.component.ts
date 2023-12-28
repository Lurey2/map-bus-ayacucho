import {
  AfterViewInit,
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
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
import 'leaflet';
import 'leaflet-routing-machine';
import { DataService } from 'src/app/core/data/data.service';

declare let L: any;

import 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-polylinedecorator';
import { openrouteservice } from 'leaflet-routing-machine';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { MatDialog } from '@angular/material/dialog';
import { MapNearbyRouteComponent } from '../map-nearby-route/map-nearby-route.component';
import { MarkerLocation } from 'src/app/core/customModel/markerLocation';
@Component({
  selector: 'app-mapleaflet',
  templateUrl: './mapleaflet.component.html',
  styleUrls: ['./mapleaflet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapleafletComponent implements OnInit,AfterViewInit, OnDestroy {

  waypointsL: any[] = [];
  map!: Map;


  arrowView : { cod : any , direcction : any } = null ;
  rutaSelect = null;
  currentPosition = null;

  public viewRoute = false;
  formRoute: FormGroup = null;
  optionActive = '';

  drawnItems: FeatureGroup = featureGroup();
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

  drawOptions: any = {
    position: 'topright',
    edit: {
      featureGroup: this.drawnItems,
    },
  };

  routinControl = [];
  polyDecorator = [];
  arrow = [];



  routeNearby = [];

  subjectDestoy = new Subject<void>();

  @Output() routeLoad = new EventEmitter();

 options = {
    layers: [this.streetMaps],
    zoom: 17,
    center: latLng([-13.16058, -74.2268953]),
    zoomControl: false,
  };




  originMaker = null;
  destinyMaker = null;

  constructor(
    private ngZone: NgZone,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private clipboard : Clipboard,
    private route: ActivatedRoute,
    private matDialog : MatDialog
  ) {
    this.formRoute = this.formbuilder.group({
      origin: [null, Validators.compose([Validators.required])],
      destiny: [null, Validators.compose([Validators.required])],
    });


    const iconS = L.icon({
      iconUrl: 'assets/stop.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'origen_svg'
      });

    const iconD = L.icon({
      iconUrl: 'assets/run.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'destiny_svg'

    });


    this.originMaker = L.marker([], { icon: iconS });
    this.destinyMaker = L.marker([], { icon: iconD });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const center =
        params.get('lat') && params.get('lng')
          ? latLng([
              parseFloat(params.get('lat')),
              parseFloat(params.get('lng')),
            ])
          : null;
      const zoom = parseInt(params.get('zoom'));
      if (!zoom && center) {
        this.options.center = center;
      } else if (zoom && center) {
        this.options.center = center;
        this.options.zoom = zoom;
      }
    });
    this.formRoute.valueChanges.subscribe(() => {
      if (this.formRoute.valid) {
        const value = this.formRoute.value;
        this.dataService
          .routerWays()
          .nearbyRoute(value.origin, value.destiny)
          .subscribe((response: any) => {
            this.closeArrowView();
            const route = response.map((v) => v.Route);
            this.routeNearby = response;
            this.routeLoad.emit(route);
            if (response.length > 0) {
               this.insertNearRoute([response[0].Route]);
             }
          });
      }
    });
    this.listLocations();
  }

  ngAfterViewInit(): void {
   setTimeout(() => {

      this.loadCopyUrl();
   }, 500);
  }

  loadCopyUrl(){

    const parametro = this.route.snapshot.params['code'];
    if (parametro) {

      try {
        let objectdescrypt = JSON.parse(CryptoJS.AES.decrypt(decodeURIComponent(parametro), '281198').toString(CryptoJS.enc.Utf8));

        this.viewRoute = true ;
        if (objectdescrypt.origin) {
          this.formRoute.get('origin').setValue(objectdescrypt.origin);
          this.originMaker.setLatLng(objectdescrypt.origin);
          this.originMaker.addTo(this.map);
          this.map.setView(objectdescrypt.origin);
        }
        if (objectdescrypt.destiny) {
          this.formRoute.get('destiny').setValue(objectdescrypt.destiny);
          this.destinyMaker.setLatLng(objectdescrypt.destiny);
          this.destinyMaker.addTo(this.map);
        }
      } catch (error) {
          console.log('NO JUEGUE CON LA WEB')
      }
    }
  }

  public changeViewNearbRoute(state: boolean) {
    this.viewRoute = state;
    if (state === false) {
        this.cerrarSeleccionRuta();
        this.formRoute.reset();
        this.controlClear();
        this.map.removeLayer(this.originMaker);
        this.map.removeLayer(this.destinyMaker);
        this.loadRoute();
    }
  }

  activeSelectPosition(option: string) {
    if (this.optionActive === option) {

      this.optionActive = '';
    } else {
      this.optionActive = option;
    }
  }

   setLocaleToForm(control){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
        this.formRoute.get(control).setValue(latlng);
        if (control === 'origin') {
          this.originMaker.setLatLng(latlng);
          this.originMaker.addTo(this.map);
        } else {
          this.destinyMaker.setLatLng(latlng);
          this.destinyMaker.addTo(this.map);
        }
      }, (error) => {
        this.dataService.messages().openSnackBar('Activar permiso de Activacion');
      });
    } else {
      console.log("Geolocalización no soportada por el navegador");
    }
  }

  getControlValueLtnLat(control: string) {
    const valueJson = this.formRoute.get(control).value;
    if (valueJson?.lat && valueJson.lng) {
      return `${valueJson.lat.toFixed(4)}... , ${valueJson.lng.toFixed(4)}... `;
    }
    return '';
  }

  public selectMap(e: any) {
    if (this.optionActive !== '') {
      this.formRoute.get(this.optionActive).setValue(e.latlng);
       if (this.optionActive === 'origin') {
        this.originMaker.setLatLng(e.latlng);
        this.originMaker.addTo(this.map);
      } else {
        this.destinyMaker.setLatLng(e.latlng);
        this.destinyMaker.addTo(this.map);
      }
      this.optionActive = '';
    }

  }

  eventZoom(e: any) {
    //  console.log(e);
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


  public center(event: LatLng) : void {
    console.log(event)
    this.map.setView(event);
  }

  addDataList(storage: any[], response: any[]) {
    response.forEach((val) => {
      let exist = storage.some((data) => data.ID === val.ID);
      if (!exist) {
        storage.push(val);
      }
    });
    return storage;
  }

  loadRoute() {
    this.controlClear();
    this.dataService
      .routerWays()
      .getActivos()
      .subscribe((response: any) => {
        console.log(response);
        this.routeLoad.emit(response);
        this.insertNearRoute(response.slice().reverse());
      });
  }

  onMapReady(event: Map) {
    this.map = event;
    this.map.addControl(L.control.zoom({ position: 'bottomleft' , zoomInText: '+' , zoomOutText: '-' , zoomInTitle :'Zoom in' , zoomOutTitle : 'Zoom out' }));

    this.loadRoute();
    var southWest = L.latLng(-13.111580118251648, -74.17745590209962);
    var northEast = L.latLng(-13.213876734947641, -74.25710678100587);
    var bounds = L.latLngBounds(southWest, northEast);
    this.map.setMaxBounds(bounds);

    this.map.on('locationfound' , (e) => {
      var radius = e.accuracy / 2;
      L.circle(e.latlng, radius).addTo(this.map);
      this.currentPosition = e.latlng;

    })
    this.map.locate({setView: false, watch: true, maxZoom: 8});


    this.map.on('moveend', (event) => {
      // Get the new center of the map
      const center = event.target.getCenter();

      // Get the new zoom level of the map
      const zoom = event.target.getZoom();
      this.updateMapPositon(center, zoom);
    });
    this.map.on('contextmenu', ($event) => {


      const dialog = this.matDialog.open(MapNearbyRouteComponent, {

        data: {
          latlng: $event.latlng,
        },
      });

      dialog.afterClosed().subscribe((data) => {
        if(data){
          this.cerrarSeleccionRuta();
          this.viewRouteData(data.Route)
        }
      });

    });
  }
  //Min Zoom 7
  //Max Zoom 18


  generateRoute(data){
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
              this.closeArrowView();
              this.map.removeControl(route);
              route.addTo(this.map);
              this.rutaSelect = data.Name;
              var routeLine = routeL.coordinates;
              const arrow = L.polylineDecorator(routeLine, {
                patterns: [
                    {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: data.Color, fillOpacity: 1}})}
                ]
              })
              arrow.addTo(this.map);

              this.polyDecorator.push(arrow);
            });
          });
          return line;
        },
      });
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
        });

        resolve(controlArrow);
      });
    });
  }

  addRouter(data , index) {
    if (data?.Routes?.length > 0) {


      const mapLoad = this.map;;
      const coordinates = data.Routes.map((rout) => {
        return { lng: rout.Lng, lat: rout.Lat };
      });
      const ctlrAdd = L?.Routing?.control({
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
        routeLine:  (route, options) => {
          var line = L.Routing.line(route, options);
          line.eachLayer( (l) =>  {
            l.on('click', (e) =>  {
              this.controlClear();
              /*
              this.closeArrowView();
              if (this.arrowView && this.arrowView?.cod === data.ID ) {
                this.arrowView = null;
                return ;
              }


              var routeLine = route.coordinates;


              this.map.removeControl(ctlrAdd);
              ctlrAdd.addTo(this.map);

              this.arrowView = {
              direcction : L.polylineDecorator(routeLine, {
                patterns: [
                    {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: data.Color, fillOpacity: 1}})}
                ]
              }).addTo(mapLoad) ,
              cod : data.ID
              }*/

            });
          });
          return line;
        },
      });

      if(this.viewRoute) {

        L.DomEvent.on(ctlrAdd, 'routeselected', (e) => {
          var plan = e.route;
          var routeLine = plan.coordinates;

          const controlArrow =  L.polylineDecorator(routeLine, {
            patterns: [
                {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color: data.Color, fillOpacity: 1}})}
            ]
          }).addTo(mapLoad);
          this.arrow.push(controlArrow)
        });
      }


      ctlrAdd.setPosition('topright');
      ctlrAdd.addTo(this.map);
      this.routinControl.push(ctlrAdd);
    }
  }

  insertNearRoute(route : any[]){
    this.controlClear();

    route.forEach((item , index) => {
      const routeGenerate = this.generateRoute(item);

      routeGenerate.setPosition('topright');
      routeGenerate.addTo(this.map);

      this.routinControl.push(routeGenerate);
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

  viewRouteData(route){
    this.controlClear();
    const routeGenerate = this.generateRoute(route);
    this.generateArrow(routeGenerate , route).then((r : any) => {
      r.addTo(this.map)
      this.polyDecorator.push(r);
    });
    routeGenerate.addTo(this.map);
    this.routinControl.push(routeGenerate);

  }

  cerrarSeleccionRuta(){
    this.rutaSelect = null;
    this.closeArrowView();
  }





  arrowHead(pointInitial : LatLng , PointEnd : LatLng, color) {


    const polyline = L.polyline([pointInitial , PointEnd]).addTo(this.map);
    polyline.setStyle({
      color: color,
      weight: 5,
      opacity: 0.7,
      dashArray: [10,20]
    });


    const decorator = L.polylineDecorator(polyline, {
      patterns: [
        {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {color: color, fillOpacity: 1, weight: 4}})}
      ]
    }).addTo(this.map);
    this.polyDecorator.push(decorator);
    this.polyDecorator.push(polyline);

  }

  copyRoute(){
    const encondeObject = CryptoJS.AES.encrypt(JSON.stringify(this.formRoute.value),'281198').toString();
    const url = window.location.origin + "/map/";
    const codeK = url +encodeURIComponent(encondeObject);
    this.clipboard.copy(codeK)
    this.dataService.messages().openSnackBar('Direccion copiada' , 1000);
  }


  findRouteId(routeId){
    return this.routeNearby.find((r) => r.Route.ID === routeId);
  }

  controlClear() {

    //this.closeArrowView();
    this.routinControl.forEach((controlValue) => {
      controlValue.remove();
      this.map.removeControl(controlValue);
    });
    this.polyDecorator.forEach((poly) => {
      poly.remove();
    });
    this.routinControl = [];
    this.polyDecorator = [];
  }

  updateMapPositon(position, zoom) {
    this.ngZone.run(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { lat: position.lat, lng: position.lng, zoom: zoom },
        queryParamsHandling: 'merge',
      });
    });
  }

  ngOnDestroy(): void {
    this.subjectDestoy.next();
    this.subjectDestoy.complete();
  }

  public ubicarse() {
    if (navigator.geolocation) {
      this.map.setView(this.currentPosition);
      console.log(this.currentPosition);
    } else {
      console.log('Geolocalización no soportada por el navegador');
    }
  }

  closeArrowView(){
    this.polyDecorator.forEach((poly) => {
      poly.remove();
    });
    this.polyDecorator = [];
  }
}
