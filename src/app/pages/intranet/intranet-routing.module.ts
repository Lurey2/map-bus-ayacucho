import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path : 'gestion',
        loadChildren: () =>
          import('./gestion-rutas/gestion-rutas.module').then(
            (m) => m.GestionRutasModule
          ),
      },
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntranetRoutingModule {}
