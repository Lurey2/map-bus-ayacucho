import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { HomeComponent } from './home/home.component';
import { MapleafletComponent } from './mapleaflet/mapleaflet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdenMapComponent } from './orden-map/orden-map.component';
import { MapNearbyRouteComponent } from './map-nearby-route/map-nearby-route.component';
import { MapLocationsComponent } from './map-locations/map-locations.component';

@NgModule({
  declarations: [
    HomeComponent,
    MapleafletComponent,
    OrdenMapComponent,
    MapNearbyRouteComponent,
    MapLocationsComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
  ]
})
export class MapModule { }
