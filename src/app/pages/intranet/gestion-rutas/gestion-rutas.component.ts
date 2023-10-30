import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';
import { ListRutasComponent } from './list-rutas/list-rutas.component';
import { RutasEditComponent } from './rutas-edit/rutas-edit.component';

import 'leaflet';
import 'leaflet-routing-machine';
import { DataMarker } from 'src/app/core/model/Datamarker';
import { ActivatedRoute, Router } from '@angular/router';
declare let L: any;
@Component({
  selector: 'app-gestion-rutas',
  templateUrl: './gestion-rutas.component.html',
  styleUrls: ['./gestion-rutas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionRutasComponent implements OnInit {

  constructor(private matDialog: MatDialog, private dataService :DataService , private router : Router,private activeRoute : ActivatedRoute, ) {}

  ngOnInit(): void {
  }

  openRutas() {
    const dialog = this.matDialog.open(RutasEditComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
      },
      width: '600px',
    });
  }



  openListRutas() {
    const dialog = this.matDialog.open(ListRutasComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
      },
      width: '1000px',
    });
  }

  openLocations(){
    this.router.navigate([ '/intranet/gestion/location'] , { relativeTo : this.activeRoute.parent});
  }

}
