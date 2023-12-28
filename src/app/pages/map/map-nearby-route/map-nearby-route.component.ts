import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';


//dependecy leaflet


@Component({
  selector: 'app-map-nearby-route',
  templateUrl: './map-nearby-route.component.html',
  styleUrls: ['./map-nearby-route.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class MapNearbyRouteComponent implements OnInit   {

  routeNear = [];

  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService,private cdr: ChangeDetectorRef){

    this.loadRouteNearby();
  }

  ngOnInit(): void {
  }


  loadRouteNearby(){
    this.dataService.loadings().show()
    this.dataService.routerWays().searchRouteNearby(this.data.latlng).pipe(finalize(() =>  this.dataService.loadings().close())).subscribe((response : any) => {
      this.routeNear = response;
      this.cdr.detectChanges();
    })
  }


}
