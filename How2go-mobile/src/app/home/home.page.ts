import { Component } from '@angular/core';
import { Map, tileLayer, marker, icon } from 'leaflet';
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
      this.map.setView([this.lat, this.long], 15);
    }).catch((error) => {
      console.log('Error getting location', error);
    });


  }

  leafletMap() {
    this.map = new Map('mapId');
    // Initialise map with user current position
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.map.setView([resp.coords.latitude, resp.coords.longitude], 15);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const customMarkerIcon = icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
      iconSize: [26, 41],
      iconAnchor: [13, 41],
      popupAnchor: [0, -41]

    });

    marker([48.9268721, 2.339048], { icon: customMarkerIcon })
      .bindPopup(`<b>trotinette</b>`, { autoClose: false })
      .addTo(this.map);
    // .on('click', () => this.router.navigateByUrl('/')) on click naviate to vehicle page
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }



}
