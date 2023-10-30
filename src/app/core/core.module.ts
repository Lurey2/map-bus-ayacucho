import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data/data.service';
import { GenericService } from './data/generic.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ], providers :[
    DataService,
    GenericService,
  ]
})
export class CoreModule { }
