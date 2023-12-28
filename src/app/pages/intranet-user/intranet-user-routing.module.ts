import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntranetUserComponent } from './intranet-user.component';
import { HomeIntranetComponent } from './home-intranet/home-intranet.component';
import { UserInformationComponent } from './user-information/user-information.component';

const routes: Routes = [
  {
    path : '',
    component: IntranetUserComponent,
    children : [
      {
        path : '',
        component: HomeIntranetComponent
      },
      {
        path: 'route',
        loadChildren : () => import('../../pages/intranet-user/gestion-ruta-user/gestion-ruta-user.module').then(m => m.GestionRutaUserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntranetUserRoutingModule { }
