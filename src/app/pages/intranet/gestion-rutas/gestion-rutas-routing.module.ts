import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionRutasComponent } from './gestion-rutas.component';
import { MapComponent } from './map/map.component';
import { MapEditComponent } from './map-edit/map-edit.component';
import { LocationComponent } from './location/location.component';

const routes: Routes = [
  {
    path: '',
    component:GestionRutasComponent,
    children: [
      {
        path : '' ,
        component : MapComponent
      },

      {
        path : 'location',
        component : LocationComponent
      },
      {
        path : ':id',
        component : MapEditComponent
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRutasRoutingModule { }
