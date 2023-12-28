import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, finalize, startWith, takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';
import { TableLoading } from 'src/app/core/util/TableLoading';
import { RutasEditComponent } from '../rutas-edit/rutas-edit.component';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-list-rutas',
  templateUrl: './list-rutas.component.html',
  styleUrls: ['./list-rutas.component.scss'],
})
export class ListRutasComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['index', 'name', 'description', 'color', 'state', 'option'];
  dataSource!: TableLoading;
  formcontrolValue = new FormControl();

  InitialValueTable = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  $unsuscribe = new Subject<void>();
  constructor(private dataService: DataService, private dialog: MatDialog, private router : Router,private activeRoute : ActivatedRoute,private dialogRef: MatDialogRef<ListRutasComponent>) {
    this.dataSource = new TableLoading();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.formcontrolValue.valueChanges
      .pipe(startWith(null), takeUntil(this.$unsuscribe), debounceTime(300))
      .subscribe((changeValue: any) => {
        if (changeValue != null) {
          const filter = changeValue.toLowerCase();
          const newdata = this.InitialValueTable.filter((val) =>{
            return val.Name.toLowerCase().includes(filter)
          }
          );
          this.setData(newdata);
        }
      });
  }

  loadData() {
    this.dataSource.loading.next(true);
    this.dataService
      .routerWays()
      .getAll()
      .pipe(finalize(() => this.dataSource.loading.next(false)))
      .subscribe((response: any) => {
        this.setData(response);
        this.InitialValueTable = response;
      });
  }

  setData(data: any[]) {
    this.dataSource = new TableLoading(data);
    this.dataSource.paginator = this.paginator;
  }

  editRow(row: any) {
    const dialog = this.dialog.open(RutasEditComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'modify',
        id: row.ID,
      },
      width: '600px',
    });

    dialog.afterClosed().subscribe((result) => {
      if (result?.state) {
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.$unsuscribe.next();
    this.$unsuscribe.complete();
  }

  observerRoute(row){
    console.log(4);
    this.router.navigate([ '/intranet/gestion/' ,row.ID] , { relativeTo : this.activeRoute.parent});
  }
}
