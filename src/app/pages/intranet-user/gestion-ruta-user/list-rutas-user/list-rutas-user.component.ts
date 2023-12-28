import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';
import { Status } from 'src/app/core/model/Response';
import { Route } from 'src/app/core/model/route';
import { ManagerRutasComponent } from '../manager-rutas/manager-rutas.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-rutas-user',
  encapsulation : ViewEncapsulation.None,
  templateUrl: './list-rutas-user.component.html',
  styleUrls: ['./list-rutas-user.component.scss']
})
export class ListRutasUserComponent implements OnInit {


  loading = false ;

  routeData : Route[] = [];


  constructor(private dataService : DataService , private dialog : MatDialog , private route: Router){

  }

  ngOnInit(): void {
    this.findRouteUser();
  }

  findRouteUser(){
    this.loading = true;
    this.dataService.routerWays().FindByIdUser().pipe(finalize(() => this.loading = false)).subscribe((response) => {
      if (response.status == Status.OK){
        this.routeData = response.data;
      }
    })
  }

  openRoute(data? : Route){
    const dialog = this.dialog.open(ManagerRutasComponent  , {
      data : data,
      width : "400px"
    })

    dialog.afterClosed().subscribe((data) => {
      if(data){
        this.findRouteUser();
      }
    }  )
  }

  delete(row : Route){
    this.loading = true;
    this.dataService.routerWays().delete(row.ID).pipe(finalize(() => this.loading = true)).subscribe((r) => {
      this.findRouteUser();
    })
  }

  view(row : Route){
    this.route.navigate(['/user/route/view/' ,row.ID])
  }
}
