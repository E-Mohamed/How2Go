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

  lat: any;
  long: any;
  map: any;
  vehicles: Vehicle[];

  customMarkerIcon = icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
  });

  constructor(private geoLocation: Geolocation, private vehicleService: VehicleService) { }

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    this.map = new Map('mapId');
    // Initialise map with user current position
    this.geoLocation.getCurrentPosition().then((pos) => {
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      this.map.setView([this.lat,this.lat], 15);
      this.initMarker(this.lat, this.long, this.customMarkerIcon);

      // Get Vehicles
      this.getVehicles(48.827251, 2.364817);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

  }

  getCurrentPosition() {
    this.geoLocation.getCurrentPosition().then((pos) => {
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      this.map.setView([this.lat, this.long], 15);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private getVehicles(longitude: number, latitude: number) {
    this.vehicleService.fetch({
      lat: latitude,
      lng: longitude
    }).subscribe(({ data }) => {
      this.vehicles = data.vehicles;
      this.addMarkers();
    });
  }

  private addMarkers() {
    for (let point of this.vehicles) {
      // create markers
      marker(
        [
          point.lat,
          point.lng
        ],
        { icon: this.customMarkerIcon }).bindPopup(point.provider.name).addTo(this.map);
    }
  }

  private initMarker(lat: number, long: number, markerIcon: any, desc?: string) {
    if (desc) {
      marker([lat, long], { icon: markerIcon })
        .bindPopup(desc, { autoClose: false })
        .addTo(this.map);
      // .on('click', () => this.router.navigateByUrl('/')) on click naviate to vehicle page
    } else {
      marker([lat, long], { icon: markerIcon })
        .addTo(this.map);
    }

  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }
}
