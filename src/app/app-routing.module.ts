import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/GuardLoginUser';
import { IntranetGuard } from './core/guard/intranet.guard';
import { LoginComponent } from './pages/login/login.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

const routes: Routes = [
  {path : "map" , loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule) },
  {path : 'intranet'  , loadChildren: () => import('./pages/intranet/intranet.module').then(m => m.IntranetModule)  , canActivate: [IntranetGuard]},
  {path : 'login' , component : LoginComponent, canActivate : [AuthGuard] },
  { path : 'informacion' , component : InformacionComponent},
  { path : 'contacto' , component : ContactoComponent},
  { path: '**', redirectTo: 'map' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
