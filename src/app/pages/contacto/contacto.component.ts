import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ContactoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  querySize(width){
    return window.matchMedia(`(min-width: ${width}px)`).matches;
  }


}
