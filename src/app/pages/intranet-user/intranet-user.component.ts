import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-intranet-user',
  encapsulation : ViewEncapsulation.None,
  templateUrl: './intranet-user.component.html',
  styleUrls: ['./intranet-user.component.scss']
})
export class IntranetUserComponent {

  openSidevar : boolean = false ;

}
