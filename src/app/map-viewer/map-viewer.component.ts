import { OnInit, OnChanges, AfterViewInit, Output, EventEmitter, Input, Component, SimpleChange } from '@angular/core';
import { LocationEvent, Map, Marker, LatLng } from 'leaflet';
import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { User } from '../user/common/user';
import { UserService } from '../user/common/user.service';

@Component({
  selector: 'my-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['map-viewer.component.scss']
})
export class MapViewerComponent implements AfterViewInit {
  public baseMaps: any;
  public map: Map;
  public circles: Array<any>;
  mapId = 'about-map';
  @Input() developers: User[];

  constructor(private uService: UserService) {
    this.circles = [];

  }

  createBaseMaps(): any {
    const ret = {
      OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
        Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>`
        }),
      Esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: `Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, 
          Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community`
        }),
      CartoDB: L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> 
        &copy; <a href="http://cartodb.com/attributions">CartoDB</a>`
        })
    };
    return ret;
  }

  ngAfterViewInit() {
    const bmps = this.createBaseMaps();
    this.map = L.map(this.mapId, {
        zoomControl: false,
        center: L.latLng(0, 0),
        zoom: 3,
        minZoom: 1,
        maxZoom: 19,
        layers: [bmps.OpenStreetMap]
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.layers(bmps).addTo(this.map);
    L.control.scale().addTo(this.map);

    if (this.developers != null) {
      this.developers.forEach((d: User) => {
        if (!(d.latitude == null || d.longitude == null)) {
          const c = '#' + ((1 << 24) * Math.random() | 0).toString(16);
          const caux = L.circle([d.latitude, d.longitude], {
            radius: 1000000 / (this.map.getZoom() * this.map.getZoom() * this.map.getZoom() / 2),
            fillColor: c,
            fillOpacity: 0.5,
            stroke: true,
            color: c
          });

          caux.bindPopup(
            `
            <div class="popup-avatar">
              <h4> ${d.userName} </h4>
              <img src="${d.avatarUrl}" />
              <p>State:${d.state}</p>
            </div>`,
            {
            'className' : 'popupCustom'
            }
          )
          .openPopup()
          .addTo(this.map);

          this.circles.push(caux);
        }
      });
    }

    this.map.on('zoomend', e => {
      this.circles.forEach((c, i) =>  {
        c.setRadius (1000000 / (this.map.getZoom() * this.map.getZoom() * this.map.getZoom() / 2));
      });
    });
  }
}
