import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/core/data/data.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit  , OnDestroy {

  $unsuscribe = new Subject<void>();

  open = false;

  constructor(private DataService : DataService , private route : Router) { }


  ngOnInit(): void {

  }

  logout() : void {
    this.DataService.localStorages().delete('SI');
    this.route.navigate(['/login']);
  }

  navigateToIntranet(){
    this.route.navigate(['/intranet/gestion']);
  }

  changeMenu(){
    this.open = !this.open;
  }

  ngOnDestroy(): void {
    this.$unsuscribe.next();
    this.$unsuscribe.complete();
  }
}
