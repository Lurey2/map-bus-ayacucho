import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/GuardLoginUser';
import { IntranetGuard } from './core/guard/intranet.guard';
import { LoginComponent } from './pages/login/login.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginUserComponent } from './pages/login-user/login-user.component';
import { RegisterUserComponent} from './pages/register-user/register-user.component';

const routes: Routes = [
  {path : "map" , loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule) },
  {path : 'intranet'  , loadChildren: () => import('./pages/intranet/intranet.module').then(m => m.IntranetModule)  , canActivate: [IntranetGuard]},
  {path : 'user' , loadChildren: () => import("./pages/intranet-user/intranet-user-routing.module").then(m => m.IntranetUserRoutingModule) } ,
  {path : 'login' , component : LoginComponent, canActivate : [AuthGuard] },
  {path : 'login-user' , component : LoginUserComponent },
  {path : 'register-user' , component : RegisterUserComponent },
  { path : 'informacion' , component : InformacionComponent},
  { path : 'contacto' , component : ContactoComponent},
  { path: '**', redirectTo: 'map' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
