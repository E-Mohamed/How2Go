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
      this.addMarker(this.lat, this.long);

      this.getVehicles(48.866667, 2.333333);
      console.log(this.vehicles);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    
    
  }

  addMarkers(){
    this.vehicles.forEach( v => this.addMarker(v.lat, v.lng)) 
  
  }

  addMarker(lat: number, long: number) { 
    marker([lat,long], {icon: this.customMarkerIcon}).bindPopup("I am here").addTo(this.map);

   }

  private getVehicles(lat: number, long: number) {
    this.vehicleService.getVehicles(long, lat)
      .subscribe(({ data }) => {
        this.vehicles = data.vehicles;
        this.addMarkers();
        this.distanceCalculator(long, lat);
      });
  }
  private distanceCalculator(lon1: number, lat1: number) {
    for (const vehicle of this.vehicles) {
      if ((lat1 === vehicle.lat) && (lon1 === vehicle.lng)) {
        return 0;
      } else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * vehicle.lat / 180;
        const theta = lon1 - vehicle.lng;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515 * 1.609344 * 1000;

        vehicle.distance = dist;
      }
    }
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }



}
