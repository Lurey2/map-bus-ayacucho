import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntranetUserRoutingModule } from './intranet-user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeIntranetComponent } from './home-intranet/home-intranet.component';
import { UserInformationComponent } from './user-information/user-information.component';


@NgModule({
  declarations: [
    HomeIntranetComponent,
    UserInformationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IntranetUserRoutingModule,
  ]
})
export class IntranetUserModule { }
