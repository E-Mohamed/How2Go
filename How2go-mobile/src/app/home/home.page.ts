import { Component } from '@angular/core';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  lat: number;
  long: number;
  map: Map;

  vehicles: Vehicle[];

  customMarkerIcon = icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]

  });

  constructor(private geoLocation: Geolocation, private vehicleService: VehicleService) { }

  ionViewDidEnter() {
    this.leafletMap();
  }

  getCurrentPosition() {
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.map.setView([this.lat, this.long], 15);
      this.getVehicles(48.866667, 2.333333);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  leafletMap() {
    this.map = new Map('mapId');
    // Initialise map with user current position
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.map.setView([this.lat, this.long], 15);

      this.getVehicles(48.866667, 2.333333);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);



    marker([48.9268721, 2.339048], { icon: this.customMarkerIcon })
      .addTo(this.map);
    // .on('click', () => this.router.navigateByUrl('/')) on click naviate to vehicle page
  }

  private getVehicles(lat: number, long: number) {
    this.vehicleService.getVehicles(long, lat)
      .subscribe(({ data }) => this.vehicles = data.vehicles);
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }



}
