import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';

@Component({
  selector: 'app-rutas-edit',
  templateUrl: './rutas-edit.component.html',
  styleUrls: ['./rutas-edit.component.scss'],
})
export class RutasEditComponent implements OnInit {
  form!: FormGroup;
  DialogTittle = '';

  constructor(
    private dataService: DataService,
    private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<RutasEditComponent>
  ) {}

  ngOnInit(): void {
    this.createadForm();
    if ((this.data.action == 'modify')) {
      this.DialogTittle = 'Modificar Ruta';
      this.loadData();
    } else {
      this.DialogTittle = 'Nueva Ruta';
    }
  }

  createadForm() {
    this.form = this.formbuilder.group({
      ID: [null],
      Name: [null, Validators.compose([Validators.required])],
      Color: [null, Validators.compose([Validators.required])],
      Description: [null, Validators.compose([Validators.required])],
      State: [true],
      Routes: [],
    });
  }

  loadData() {
    this.dataService
      .routerWays()
      .getById(this.data.id)
      .subscribe((response: any) => {
        console.log(response)
        this.form.patchValue(response);
      });
  }

  getColor(): string {
    const color = this.form.get('Color')?.value;
    if (color) {
      return color;
    }
    return 'white';
  }

  changeState(){
    this.form.get('State').setValue(!this.form.get('State').value);
  }

  save() {
    this.dataService.loadings().show();

    this.dataService
      .routerWays()
      .create(this.form.value)
      .pipe(finalize(() => this.dataService.loadings().close()))
      .subscribe((response) => {
        this.dataService.notifys().succes('Se Guardo Correctamente la ruta ');
        window.location.reload();
        this.cancel();
      });
  }

  update() {
    console.log(this.form.value)
    this.dataService.loadings().show();

    this.dataService
      .routerWays()
      .update(this.form.value)
      .pipe(finalize(() => this.dataService.loadings().close()))
      .subscribe((response) => {
        this.dataService.notifys().succes('Se Modifico Correctamente la ruta ');
        this.cancel({ state : true});
        window.location.reload();
      });
  }

  cancel(data? : any) {
    this.dialog.close(data);
  }
}
