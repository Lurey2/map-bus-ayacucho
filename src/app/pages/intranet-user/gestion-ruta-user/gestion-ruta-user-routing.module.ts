import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRutasUserComponent } from './list-rutas-user/list-rutas-user.component';
import { ViewRouteComponent } from './view-route/view-route.component';

const routes: Routes = [
  {
    path : '',
    component : ListRutasUserComponent
  },
  {
    path : "view/:ID",
    component : ViewRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRutaUserRoutingModule { }
