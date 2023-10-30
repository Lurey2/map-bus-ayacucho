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
import { UtilsList } from 'src/app/core/util/UtilsList';
@Component({
  selector: 'app-orden-map',
  templateUrl: './orden-map.component.html',
  styleUrls: ['./orden-map.component.scss']
})
export class OrdenMapComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['index', 'name','color', 'option'];
  dataSource!: TableLoading;
  formcontrolValue = new FormControl();

  InitialValueTable = [];


  $unsuscribe = new Subject<void>();
  constructor(private dataService: DataService, private dialog: MatDialog, private dialogRef: MatDialogRef<OrdenMapComponent>) {
    this.dataSource = new TableLoading();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {

  }


  loadData() {
    this.dataSource.loading.next(true);
    this.dataService
      .routerWays()
      .getActivos()
      .pipe(finalize(() => this.dataSource.loading.next(false)))
      .subscribe((response: any) => {

        this.setData(response);
        this.InitialValueTable = response;
      });
  }

  setData(data: any[]) {
    this.dataSource = new TableLoading(data);
  }



  ngOnDestroy(): void {
    this.$unsuscribe.next();
    this.$unsuscribe.complete();
  }

  close(row){
    this.dialogRef.close(row)
  }

  changePosition(numberIndex : number  , index : number) {
      let listData = this.dataSource.data;
      const newList = UtilsList.PushIndex(listData , index, index + numberIndex)
      this.dataSource.data = newList;
  }

  guardar(){
    this.dataService.localStorages(  ).storage(this.dataSource.data , 'orderPath');
    window.location.reload();
    this.dialogRef.close([true]);

  }

}
