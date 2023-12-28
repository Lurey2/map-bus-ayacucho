import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LatLng, LeafletMouseEvent, Map, Point, latLng, tileLayer } from 'leaflet';

declare let L: any;

import 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-polylinedecorator';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/core/data/data.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { Graphc, markerCustom } from 'src/app/core/util/graphc';
import { Route } from 'src/app/core/model/route';
import { ActivatedRoute } from '@angular/router';
import { PointInterface } from 'src/app/core/model/Point.model';

@Component({
  selector: 'app-view-route',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './view-route.component.html',
  styleUrls: ['./view-route.component.scss'],
  imports: [LeafletModule, CommonModule, OverlayModule],
  standalone: true,
})
export class ViewRouteComponent   {
  @ViewChild('menuItem', { static: true }) menuItem: ElementRef;

  route : Route;

  map!: Map;
  graphc: Graphc;

  menuShowState: boolean = false;
  positionMenu = { x: '0px', y: '0px' };
  dataMenu : { latlng? : LatLng  , data?: PointInterface  } = {};
  dataConnect : { from? : PointInterface ,  to?: PointInterface} = {};
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  options = {
    layers: [this.streetMaps],
    zoom: 17,
    center: latLng([-13.16058, -74.2268953]),
    zoomControl: false,
  };

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private  activeRoute : ActivatedRoute
  ) {}

  onMapReady(event: Map) {
    this.map = event;
    this.graphc = new Graphc(event);

    this.map.addControl(
      L.control.zoom({
        position: 'bottomleft',
        zoomInText: '+',
        zoomOutText: '-',
        zoomInTitle: 'Zoom in',
        zoomOutTitle: 'Zoom out',
      })
    );
    this.map.addEventListener('contextmenu', ($event) => this.eventContextMap($event));
    this.getRoute();
    this.map.addEventListener("click", ($event) => this.eventClickMap($event) )

  }

  eventClickMap(mouseEvent : LeafletMouseEvent){
    this.close();
    this.dataConnect = {};
    L.DomUtil.removeClass(this.map.getContainer(),'crosshair-cursor-enabled');

  }

  eventClickMarker(mouseEvent : LeafletMouseEvent){
    const dataMarker = mouseEvent.target as markerCustom;
    L.DomUtil.removeClass(this.map.getContainer(),'crosshair-cursor-enabled');
    if(this.dataConnect.from){
      this.graphc.connect(this.dataConnect.from , dataMarker.data)
      this.dataConnect = {};
    }
  }

  eventContextMap(mouseEvent: LeafletMouseEvent) {

    this.dataMenu = {latlng : mouseEvent.latlng}
    this.show(mouseEvent);
  }

  eventContextMarker(mouseEvent:  LeafletMouseEvent){
    this.dataConnect = {};
    const dataMarker = mouseEvent.target as markerCustom;

    this.dataMenu = {  latlng : mouseEvent.latlng  , data : dataMarker.data};
    this.show(mouseEvent);
  }

  createPoint(latlng : LatLng){
    const marker = this.graphc.insertPoint(latlng);
    marker.addEventListener("click" , ($event) => this.eventClickMarker($event))
    marker.addEventListener("contextmenu" , ($event) => this.eventContextMarker($event))

    this.close();
  }


  getRoute(){
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get("ID");
      this.dataService.routerWays().getById(id).subscribe((route ) => {
        this.route = route;
        this.graphc.setPoints(route.Routes);
        this.graphc.addEventMarker("contextmenu" , ($event) => this.eventContextMarker($event))
        this.graphc.addEventMarker("click" , ($event) => this.eventClickMarker($event))

      })
    })
  }

  update(){

    this.route.Routes = this.graphc.getDataPoint();
    this.dataService.routerWays().update(this.route).subscribe((data) => {
      console.log(data);
    })
    this.close();
  }

  delete(point : PointInterface){
    this.graphc.delete(point);
    this.close();
  }


  show(mouseEvent : LeafletMouseEvent){
    this.menuShowState = true;
    this.cdr.detectChanges();


    const menuElement = document.getElementById('menu-item');
    const  mapElement = document.getElementById("map-leaflet")

    menuElement.style.opacity = '0';

    const dimMenu = menuElement.getBoundingClientRect();
    const dimMap = mapElement.getBoundingClientRect();

    const posx = mouseEvent.containerPoint.x;
    const posy = mouseEvent.containerPoint.y;
    if (posx + dimMenu.width >= dimMap.width && posy + dimMenu.height >= dimMap.height) {
      this.positionMenu = { x: `${posx - dimMenu.width}px`, y: `${posy - dimMenu.height}px` };
    } else if (posx + dimMenu.width >= dimMap.width) {
      this.positionMenu = {x : `${posx - dimMenu.width }px` ,  y : `${posy}px` }
    } else if (posy + dimMenu.height >= dimMap.height) {
      this.positionMenu = {x : `${posx }px` ,  y : `${posy - dimMenu.height}px` }
    } else {
      this.positionMenu = {x : `${posx }px` ,  y : `${posy}px` }
    }

    menuElement.style.opacity = '1';
    this.cdr.detectChanges();
  }

  close(){
    this.menuShowState = false;
    this.cdr.detectChanges();
  }

  connect(fromPoint : PointInterface){
    this.dataConnect.from = fromPoint;
    L.DomUtil.addClass(this.map.getContainer(),'crosshair-cursor-enabled');
    this.close();
  }
}
