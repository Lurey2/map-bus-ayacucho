import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { latLng, tileLayer , Map, marker, Marker } from 'leaflet';

import 'leaflet';
import { LocationEditComponent } from '../location-edit/location-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/core/data/data.service';
import { MarkerLocation } from 'src/app/core/customModel/markerLocation';
declare let L: any;
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  map!: Map;

  show : boolean = false;
  positionX : number = 0 ;
  positionY : number = 0 ;
  data = null;

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  });

  options = {
    layers: [this.streetMaps ],
    zoom: 17,
    center: latLng([-13.16058, -74.2268953]),
    zoomControl: false,

  };

  constructor(private dataService : DataService,private cdr: ChangeDetectorRef, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.listLocations();
  }

  onMapReady(event: Map) {
    console.log('cargando mapa')
    this.map = event;
    this.map.on('contextmenu', ($event) => {

      this.show = true;
      this.data = { event : $event};
      this.positionX = $event.containerPoint.x;
      this.positionY = $event.containerPoint.y;
      this.cdr.detectChanges();
    })

    this.map.on('click', ($event) => {
      this.close();
    })
   }



  close(){
    this.show = false;
    this.cdr.detectChanges();
  }

  crearLocation(){

    const dialogRef = this.dialog.open(LocationEditComponent , {
      data : { event : this.data.event  },
      width : '400px'
    });

    dialogRef.afterOpened().subscribe(() => {
      // Forzar la detección de cambios
      console.log('detectando cambio')
      this.cdr.detectChanges();
    });

    dialogRef.afterClosed().subscribe((r) => {
      if (r){
        this.listLocations();
      }
    })
    this.close();
  }

  UpdateLocation(){

    const dialogRef = this.dialog.open(LocationEditComponent , {
      data : this.data,
      width : '400px'
    });

    dialogRef.afterOpened().subscribe(() => {
      // Forzar la detección de cambios
      console.log('detectando cambio')
      this.cdr.detectChanges();
    });

    dialogRef.afterClosed().subscribe((r) => {
      if (r){
        this.listLocations();
      }
    })
    this.close();
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
        marker.addEventListener('contextmenu' , ($event) => {

          this.show = true;
          this.data = { event : $event , location : $event.target.data  };
          this.positionX = $event.containerPoint.x;
          this.positionY = $event.containerPoint.y;
          this.cdr.detectChanges();
        })
        marker.addTo(this.map).bindPopup(location.Name);
      });
    })
  }

}

