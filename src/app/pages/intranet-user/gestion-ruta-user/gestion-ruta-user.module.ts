import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRutaUserRoutingModule } from './gestion-ruta-user-routing.module';
import { ListRutasUserComponent } from './list-rutas-user/list-rutas-user.component';
import { ManagerRutasComponent } from './manager-rutas/manager-rutas.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewRouteComponent } from './view-route/view-route.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [
    ListRutasUserComponent,
    ManagerRutasComponent,
  ],
  imports: [
    CommonModule,
    GestionRutaUserRoutingModule,
    SharedModule,
    LeafletModule
  ],
})
export class GestionRutaUserModule { }
