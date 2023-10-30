import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-market-icon-component',
  templateUrl: './market-icon-component.component.html',
  styleUrls: ['./market-icon-component.component.scss']
})
export class MarketIconComponentComponent  extends L.Icon{

  constructor() {
    super({
      iconUrl: '',
      iconSize: [300, 100],
      iconAnchor: [150, 50],
      popupAnchor: [0, -50],
    });
  }
}
