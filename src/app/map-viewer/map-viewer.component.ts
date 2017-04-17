import { OnInit, OnChanges, AfterViewInit, Output, EventEmitter, Input, Component, SimpleChange } from '@angular/core';
import { LocationEvent, Map, Marker, LatLng } from 'leaflet';
import { Injectable } from '@angular/core';
import { MapViewerService } from './map-viewer.service';

import { Subscription } from 'rxjs/Subscription';
import { User } from '../user/common/user';

@Component({
  selector: 'my-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements AfterViewInit {
  public map: Map;
  public circles: Array<any>;
  @Input() mapId: string;
  @Input() developers: User[];

  constructor(private mapService: MapViewerService) {
    this.circles = [];

  }

  ngAfterViewInit() {
    const bmps = this.mapService.createBaseMaps();
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

    // Creating random data waiting for backend
    const a1 = (Math.random() * 50000);
    if (this.developers != null) {
      this.developers.forEach((d: User) => {
        let lat =  (Math.random() * 90);
        let lng =  (Math.random() * 180);
        const a2 = Math.round(Math.random() * 100);
        const a3 = Math.round(Math.random() * 100);
        if (a3 % 2) {
          lat *= -1;
        }
        if (a2 % 2) {
          lng *= -1;
        }

        const caux = L.circle([lat, lng], {
          radius: (Math.random() * 50000) * 5000 / (1 / this.map.getZoom() * 1000),
          fillColor: '#' + ((1 << 24) * Math.random() | 0).toString(16),
          fillOpacity: 0.5,
          stroke: false
        });

        caux.bindPopup(
          '<h4>' + d.userName + '</h4>' +
          '<p><b>Codes: ' + a1 + ' </b></p>' +
          '<p>Lat: ' + lat + '</p>' +
          '<p>Lng: ' + lng + '</p>'
          , {
        })
        .openPopup()
        .addTo(this.map);

        this.circles.push(caux);
      });
    }

    this.map.on('zoomend', e => {
      this.circles.forEach((c, i) =>  {
        c.setRadius ((Math.random() * 50000) * 5000 / (1 / this.map.getZoom() * 1000));
      });
    });
  }
}
