import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/core/data/data.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformacionComponent implements OnInit {


  rutas = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.routerWays().getAll().subscribe((r) => {this.rutas = r; console.log(r)});
  }

  querySize(width){
    return window.matchMedia(`(min-width: ${width}px)`).matches;
  }

}
