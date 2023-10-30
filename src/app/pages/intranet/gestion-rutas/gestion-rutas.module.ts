import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRutasRoutingModule } from './gestion-rutas-routing.module';
import { MapComponent } from './map/map.component';
import { GestionRutasComponent } from './gestion-rutas.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RutasEditComponent } from './rutas-edit/rutas-edit.component';
import { ListRutasComponent } from './list-rutas/list-rutas.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { LocationComponent } from './location/location.component';
import { LocationEditComponent } from './location-edit/location-edit.component';


@NgModule({
  declarations: [
    MapComponent,
    GestionRutasComponent,
    RutasEditComponent,
    ListRutasComponent,
    MapEditComponent,
    LocationComponent,
    LocationEditComponent
  ],
  imports: [
    CommonModule,
    GestionRutasRoutingModule,
    SharedModule
  ],
  entryComponents : [LocationEditComponent]
})
export class GestionRutasModule { }
