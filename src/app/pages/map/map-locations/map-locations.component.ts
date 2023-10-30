import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';
import { LocationC } from 'src/app/core/model/Location';

@Component({
  selector: 'app-map-locations',
  templateUrl: './map-locations.component.html',
  styleUrls: ['./map-locations.component.scss']
})
export class MapLocationsComponent implements OnInit {


  searchLocationControl = new FormControl('');

  locationList = [];
  locationListScroll = [];
  dataSource = [];

  size = 5 ;
  index = 1;
  listSize = 0;

  constructor(private dataService: DataService, private dialog: MatDialog, private dialogRef: MatDialogRef<MapLocationsComponent>){

  }

  ngOnInit(): void {
    this.loadLocation();
    this.searchLocationControl.valueChanges.pipe(debounceTime(100)).subscribe((v) => {
      this.index = 1;
      this.locationList = this.dataSource.filter((f : LocationC) => f.Name.toLocaleLowerCase().includes(v.toLocaleLowerCase()))
      this.locationListScroll = this.locationList.slice(0, (this.index + 1)  * this.size);
    })
  }

  loadLocation(){
    this.dataService.locations().getAll().subscribe((r : any) => {
      this.locationList = r;
      this.dataSource = r;
      this.locationListScroll = this.locationList.slice(0, (this.index + 1)  * this.size);
    });
  }

  ubicarLugar(row){
    this.dialogRef.close(row);
  }

  onScrollEnd(){
    const itemShow = (this.index + 1) * this.size;
      if ( itemShow <  this.locationList.length){
        this.index++;
        this.locationListScroll = this.locationList.slice(0 , this.size * (this.index + 1));
      }
  }

}
