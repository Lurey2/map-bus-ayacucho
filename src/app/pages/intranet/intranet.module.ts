import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntranetRoutingModule } from './intranet-routing.module';

import { MainComponent } from './main/main.component';
import { NavigationComponent } from './main/layout/navigation/navigation.component';
import { SidevarComponent } from './main/layout/sidevar/sidevar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionRutasComponent } from './gestion-rutas/gestion-rutas.component';


@NgModule({
  declarations: [

    MainComponent,
    NavigationComponent,
    SidevarComponent,
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule,
    SharedModule
  ]
})
export class IntranetModule { }
