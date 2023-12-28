import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidevar',
  templateUrl: './sidevar.component.html',
  styleUrls: ['./sidevar.component.scss']
})
export class SidevarComponent implements OnInit {

  sidervarClass: string = 'desactiveS';

  constructor() { }

  ngOnInit(): void {
  }

  changeStateSidevar(){
    if (this.sidervarClass === 'activeS') {
      this.sidervarClass = 'desactiveS'
    } else {
      this.sidervarClass = 'activeS';
    }
  }

  probando(){
    console.log('ag')
  }

}
