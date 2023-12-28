import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  circle,
  Control,
  control,
  FeatureGroup,
  featureGroup,
  Icon,
  icon,
  LatLng,
  latLng,
  LayerGroup,
  Map,
  marker,
  polygon,
  polyline,
  tileLayer,
} from 'leaflet';
import { MAX_ZOOM } from 'src/app/config/util.const';

import 'leaflet';
import 'leaflet-routing-machine';
import { rutasO } from 'src/app/config/rutas';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, Subscription } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, finalize, take } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataMarker } from 'src/app/core/model/Datamarker';
import { ActivatedRoute, Data, Route } from '@angular/router';
import { NodeIndex } from 'src/app/core/model/nodeIndex';
import { DataService } from 'src/app/core/data/data.service';
declare let L: any;

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEditComponent implements OnInit, AfterViewInit {
  //define variable
  layers: any;
  color  = '#0199FF';
  waypointsL: any[] = [];
  zones = featureGroup();
  map!: Map;
  contrl: DataMarker[] = [];
  BusRoute : any ;

  sub: Subscription;
  @Output() mapAddRoute = new EventEmitter<any>();
  overlayRef: OverlayRef | null;
  drawnItems: FeatureGroup = featureGroup();

  //data
  @Input('route') routeObserver: any;

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  // Marker for the parking lot at the base of Mt. Ranier trails

  // Path from paradise to summit - most points omitted from this example for brevity

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [this.streetMaps],
    zoom: 17,
    center: latLng([-13.16058, -74.2268953]),
    zoomControl: false,

    //center: latLng([57.74, 11.94]),
  };

  zoomOptions = {};

  @ViewChild('contextMenuOption', { static: true }) contextMenuOption;

  isContextMenuVisible = false;
  selectPosition = null;
  nodeValue = null;
  itemInitial = [
    {
      text: 'Crear Nodo',
      items: [
        { text: 'Visible', code: 'Visible' },
        { text: 'Invisible', code: 'Invisible' },
      ],
    },
    {
      text: 'Guardar',
      code: 'guardar',
    },
  ];

  connectNode : {from : DataMarker , to : DataMarker} = {from : null , to : null};

  constructor(
    private dataService: DataService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private route : ActivatedRoute
  ) {
    this.items = [...this.itemInitial];
  }

  onDrawerLayer(e: any) {
    console.log(e);
  }

  ngOnInit(): void {
    this.loadRoute();
  }

  loadRoute() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.dataService.loadings().show();
        this.controlClear();
        this.dataService.routerWays().getById(id).pipe(finalize(() => this.dataService.loadings().close())).subscribe((route : any) => {
          this.color = route.Color;
          this.BusRoute = route;
          this.setEntityEdit(route.Routes)
        } )
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  public onDrawStart(e: any) {
    // tslint:disable-next-line:no-console
    console.log('Draw Started Event!');
  }

  setEntityEdit(data: any[]) {
    let entityMake = data.map((d) => {
      return this.createNodeMap(d, this.map);
    });

    entityMake.forEach((e) => {
      if (e.data.IndexNext > 0) {
        const markerToConnect = entityMake.find(
          (f) => f.data.Index === e.data.IndexNext
        );
        e.conectNode(markerToConnect,this.color);
      }
    });
    this.contrl = entityMake;
  }


  eventZoom(e: any) {
    //  console.log(e);
  }

  center(event: LatLng) {}

  onMapReady(event: Map) {
    this.map = event;
    this.map.addControl(
      L.control.zoom({
        position: 'bottomleft',
        zoomInText: '+',
        zoomOutText: '-',
        zoomInTitle: 'Zoom in',
        zoomOutTitle: 'Zoom out',
      })
    );
    const openPan = (val) => this.open(val);
    this.map.addEventListener('contextmenu', openPan);
  }

  open($event) {
    this.close();
    this.items = this.itemInitial;
    this.selectPosition = $event;
  }

  close() {
    this.selectPosition = null;
    this.nodeValue = null;
  }

  selectOptionContextMenu($event) {
    const optionSelect = $event.itemData.code;
    switch (optionSelect) {
      case 'Visible':
        this.createNodeOption(this.selectPosition, true);
        break;
      case 'Invisible':
        this.createNodeOption(this.selectPosition, false);

        break;
      case 'destroy':
        this.destroyNodoOption();

        break;
      case 'Conectar':
        this.conectarNodo($event);
        break;
      case 'guardar':
        this.guardar();
        break;
      case 'desconectar':
        this.desconectar();
        break;
      case 'conectionMouse' :
        this.conectionMouse($event);
        break;
      default:
        break;
    }
  }

  conectionMouse($event){
    console.log($event)
    this.connectNode = { from : null , to : null};
    this.connectNode.from = $event.itemData.node;
  }

  desconectar() {
    const node = this.nodeValue as DataMarker;
    node.desconectNode();
  }

  guardar() {
    this.BusRoute.Routes = this.contrl.map((r : DataMarker) => {
      console.log(r.data)
      return {
        Index : r.data.Index,
        IndexNext : r.data.IndexNext,
        Distance : r.data.Distance,
        Lat : r.data.Lat,
        Lng : r.data.Lng,
        Show : r.data.Show

      }
    });
    this.dataService.loadings().show();
    this.dataService.routerWays().update(this.BusRoute).pipe(finalize( () => this.dataService.loadings().close())).subscribe( () => {
    this.dataService.notifys().succes("Se ha modificado correctamente");
  });
  }

  destroyNodoOption() {
    const index = this.contrl.findIndex(
      (val) => val.data.Index === this.nodeValue.data.Index
    );

    let dataList = [].concat(
      this.contrl.slice(0, index),
      this.contrl.slice(index + 1, this.contrl.length)
    );

    this.contrl = dataList;
    this.nodeValue.destroy();
  }

  getIndexNoNode() {
    let indexV = 1;
    for (let index = 0; index < this.contrl.length; index++) {
      const element = this.contrl[index];

      if (!this.contrl.some((element) => element.data.Index === indexV)) {
        return indexV;
      }
      indexV = indexV + 1;
    }
    return indexV;
  }

  createNodeOption($event, visible) {
    const latS = $event.latlng as LatLng;

    this.contrl.push(this.createNodeMap(
      {
        Index: this.getIndexNoNode(),
        Lat: latS.lat,
        Lng: latS.lng,
        Show: visible,
      },
      this.map
    ));
  }

  createNodeMap(data: NodeIndex, map: L.Map, options?: L.MarkerOptions) {
    const layer = new DataMarker([data.Lat, data.Lng], data, this.map , {draggable: true });
    layer.on('dragend', (event)  =>  {

      layer.Lat = event.target._latlng.lat;
      layer.Lng = event.target._latlng.lng;
      layer.latLng = { lat : event.target._latlng.lat , lng : event.target._latlng.lng}
      layer.data.Lat = event.target._latlng.lat;
      layer.data.Lng = event.target._latlng.lng;
      const node = this.contrl.find((node)  => node.data.IndexNext === data.Index);
      const nodeNext = this.contrl.find((node) => node.data.Index === data.IndexNext);
      if(node){
        node.conectNode(layer , this.color);
      }
      if(nodeNext){
        layer.conectNode(nodeNext, this.color);
      }
    })

    layer.on('click', (event)  =>  {

      if (this.connectNode.from && layer.data.ID !== this.connectNode.from.data.ID) {
          this.connectNode.from.conectNode(layer , this.color);
          this.connectNode.from = null ;
      }
    })

    layer.on('contextmenu', (data) => {
      this.nodeValue = data.target;
      const ctrlFilter = this.contrl.filter(
        (e) => e.data.Index !== this.nodeValue.data.Index
      );
      this.items = [
        ...this.itemInitial,
        { text: 'destroy', code: 'destroy' },
        { text: 'desconectar', code: 'desconectar' },
        {
          text: 'Conectar',
          items: ctrlFilter.map((element) => {
            return {
              text: 'Conectar Nodo ' + element.data.Index,
              code: 'Conectar',
              node: element,
            };
          }),
        },
        {
          text : 'Conectar...' , code : 'conectionMouse' , node : data.target
        }
      ];
    });
    return layer;
  }

  conectarNodo($event) {
    const node = this.nodeValue as DataMarker;
    node.conectNode($event.itemData.node , this.color);
  }

  //Min Zoom 7
  //Max Zoom 18
  setEntity(entity: any[]) {
    entity.forEach((element) => {
      const layer = marker([element.latLnG.lat, element.latLnG.lng], {
        icon: icon({
          iconSize: [element.icon.iconSize.sizeX, element.icon.iconSize.sizeY],
          iconAnchor: [
            element.icon.iconAnchor.sizeX,
            element.icon.iconAnchor.sizeY,
          ],
          iconUrl: element.icon.iconUrl,
        }),
      });

      layer.addEventListener('click', (event: any) => {
        const latn: LatLng = event.latlng;
        //this.map.panTo(latn);
        this.map.setView(latn, MAX_ZOOM);
      });

      this.drawnItems.addLayer(layer);
    });
  }

  controlClear() {
    this.contrl.forEach((r) => r.destroy())
    this.contrl = [];
    //this.waypointsL.forEach(waypoint => waypoint.spliceWaypoints(0, 2));
  }

  items: any;

  itemClick(e) {
    if (!e.itemData.items) {
      console.log(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
    }
  }
}
