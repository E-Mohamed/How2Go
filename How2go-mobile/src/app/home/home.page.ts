import { Component } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  lat: number;
  long: number;
  map: Map;
  constructor(private geoLocation: Geolocation) { }

  ionViewDidEnter() {
    this.leafletMap();
  }

  getCurrentPosition() {
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      console.log(resp.coords.latitude);
      console.log(this.lat);
      console.log(this.long);
      this.map.setView([this.lat, this.long], 15);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
    

  }

  leafletMap() {
    console.log(this.lat);
    // Initialise map with user current position
    this.map = new Map('mapId').setView([48.9268721, 2.339048], 15);
    tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'How2Go'
      }
    ).addTo(this.map);

    // Add a marker to the map
    marker([48.936616, 2.324789])
      .addTo(this.map)
      .bindPopup('Trotinnette');

  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }



}
