import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { STORAGEKEY } from 'src/app/config/auth.config';
import { DataService } from 'src/app/core/data/data.service';
import { Status } from 'src/app/core/model/Response';
import { User } from 'src/app/core/model/user';

@Component({
  selector: 'navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.scss']
})
export class NavbarHeaderComponent  implements OnInit {

  data : User = null;

  constructor(private dataService : DataService, private router : Router){

  }

  querySize(width){
    return window.matchMedia(`(min-width: ${width}px)`).matches;
  }

  ngOnInit(): void {

    this.data  = this.dataService.localStorages().retrieve(STORAGEKEY);
    console.log(this.data)
    if (!this.data){
      this.dataService.logins().GetUser().subscribe((response) => {
        if(response.status === Status.OK ){

          this.data = response.data;

        }else if(response.Code === HttpStatusCode.Unauthorized)  {
          this.dataService.localStorages().delete(STORAGEKEY);
          this.router.navigate(["/login-user"]);
        }

      });
    }
  }

  logout() {
    this.dataService.logins().logout().subscribe((r) => {
      this.router.navigate(["/map"]);
      this.data = null;
      this.dataService.localStorages().delete( STORAGEKEY )
    })

  }

}
