import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route } from '@angular/router';
import { DataService } from 'src/app/core/data/data.service';
import { MapleafletComponent } from '../mapleaflet/mapleaflet.component';
import { OrdenMapComponent } from '../orden-map/orden-map.component';

import * as CryptoJS from 'crypto-js';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MapLocationsComponent } from '../map-locations/map-locations.component';
import { LatLng } from 'leaflet';
import { LocationC } from 'src/app/core/model/Location';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class HomeComponent implements OnInit , AfterViewInit {
  dataRoute: any[] = [];
  optionNearbyRoute = false;
  selectionBus : number = -1 ;
  @ViewChild(MapleafletComponent) mapLeaflet: MapleafletComponent;
  constructor(private dataService: DataService,private observer: BreakpointObserver, private matDialog: MatDialog, private activateRoute : ActivatedRoute) {}


  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  ngOnInit(): void {
    const parametro = this.activateRoute.snapshot.params['code'];
    if (parametro) {
      try {
        let objectdescrypt = JSON.parse(CryptoJS.AES.decrypt(decodeURIComponent(parametro), '281198').toString(CryptoJS.enc.Utf8));
        this.optionNearbyRoute = true ;
      }catch(err){
        console.log(err);
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {

      this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
    }, 0);

  }
  openOrder() {
    const dialog = this.matDialog.open(OrdenMapComponent, {
      data: {
        action: 'new',
      },
      width: '1000px',
    });

  }

  selectBus(bus , index) {
    if (index === this.selectionBus) {
        this.cerrarSeleccion();
    } else {
      this.mapLeaflet.viewRouteData(bus);
      this.selectionBus = index;
    }

  }

  cerrarSeleccion(){
    this.selectionBus = -1;
    let dataCopi = this.dataRoute.map((route) => route).reverse();
    this.mapLeaflet.insertNearRoute(dataCopi);
  }
  openDestinyRoute() {
    this.mapLeaflet.changeViewNearbRoute(true);
    this.optionNearbyRoute = true;
  }

  closedDestiny() {
    this.mapLeaflet.changeViewNearbRoute(false);
    this.optionNearbyRoute = false;
    this.selectionBus = -1;
  }

  loadRoute(val) {
    this.dataRoute = val;
  }

  ubicarse() {
    this.mapLeaflet.ubicarse();
  }

  querySize(width){
    return window.matchMedia(`(min-width: ${width}px)`).matches;
  }

  listMapas(){
    const dialog = this.matDialog.open(MapLocationsComponent, {
      panelClass: 'event-form-dialog',
      width: '600px',
    });

    dialog.afterClosed().subscribe((data: LocationC) => {

      if (data){
        this.mapLeaflet.center(new LatLng(data.Lat , data.Lng));
      }
    });
  }

}
