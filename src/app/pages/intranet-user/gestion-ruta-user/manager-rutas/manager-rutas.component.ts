import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { finalize } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';

@Component({
  selector: 'app-manager-rutas',
  templateUrl: './manager-rutas.component.html',
  styleUrls: ['./manager-rutas.component.scss']
})
export class ManagerRutasComponent implements OnInit {

  form:FormGroup;

  constructor(private dataService : DataService , private fb : FormBuilder , @Inject(MAT_DIALOG_DATA) public data : Route , private dialog: MatDialogRef<ManagerRutasComponent> ){

  }
  ngOnInit(): void {
    this.initFormBuild();
    this.patchData();
  }

  initFormBuild(){
    this.form = this.fb.group({
      ID : [null],
      Name : [null, Validators.compose([Validators.required])],
      Color : [null, Validators.compose([Validators.required])],
      Description : [null, Validators.compose([Validators.required])],

    })
  }

  patchData(){
    if(this.data){
      this.form.patchValue(this.data);
    }
  }

  save(){
    this.dataService.loadings().show();
    if(this.data){
      this.dataService.routerWays().update(this.form.value).pipe(finalize(() => this.dataService.loadings().close())).subscribe(() => {
        this.dialog.close(true)
      })
    } else{
      this.dataService.routerWays().create(this.form.value).pipe(finalize(() => this.dataService.loadings().close())).subscribe(() => {
        this.dialog.close(true)
      })
    }
  }


}
