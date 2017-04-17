import { Map } from 'leaflet';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MapViewerService {
  public map: Map;
  public baseMaps: any;
  public currentLat: number;
  public currentLng:  number;
  public altitude: number;
  public accuracy: number;
  hasLocation = false;
  public center: any;

  locationSource = new Subject<any>();

  geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
  };
  constructor() {
    this.hasLocation = false;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.altitude = position.coords.altitude;
          this.accuracy = position.coords.accuracy;
          this.hasLocation = true;

          this.locationSource.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            alt: position.coords.altitude,
            acc: position.coords. accuracy,
          });
        }, this.error, this.geoOptions);
      } else {
          alert('Geolocation services are not supported by your web browser.');
          this.hasLocation = false;
          this.locationSource.next(false);
      }
  }
  whenCurrentLocation(): Observable<any> {
    return this.locationSource.asObservable();
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

  error(error: any): void  {
      alert('Unable to retrieve your location due to ' + error.code + ': ' + error.message);
  }


  onCenterChange() {
    this.map.setView(this.center, null);
  }
}
