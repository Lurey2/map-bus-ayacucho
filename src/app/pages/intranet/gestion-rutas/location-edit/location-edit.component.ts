import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/core/data/data.service';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent implements OnInit {

  form: FormGroup = null;

  constructor( private dataService : DataService  ,@Inject(MAT_DIALOG_DATA) public data: any,private formBuilder : FormBuilder,
  public dialog: MatDialogRef<LocationEditComponent> ,private cdr: ChangeDetectorRef, ){
    console.log(data)
  }

  ngOnInit(): void {
    this.InitForm();
    this.inserData();

    this.cdr.detectChanges();
  }

  InitForm(){
    this.form = this.formBuilder.group({
      ID : [null],
      Name : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      Lat : [null, Validators.compose([Validators.required])],
      Lng: [null, Validators.compose([Validators.required])],
      Icon: [null,Validators.compose([Validators.required])],
      Color: [null,Validators.compose([Validators.required])]
    })
  }



  inserData(){
    this.form.patchValue({
      Lat :this.data.event.latlng.lat,
      Lng : this.data.event.latlng.lng
    })

    if (this.data.location){
      this.form.patchValue(this.data.location);
    }

  }



  save(){
    const id = this.form.value.ID;
    if(id > 0){
      this.dataService.locations().update(this.form.value).subscribe((r) => {
        this.dialog.close(true);
      })
    } else {
      this.dataService.locations().create(this.form.value).subscribe((r) => {
        this.dialog.close(true);
      })
    }
  }

}
