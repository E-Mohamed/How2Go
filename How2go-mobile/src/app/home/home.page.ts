import { Component } from '@angular/core';
import { Map, tileLayer, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../shared/models/vehicle.model';
import CalculDistance from '../shared/CalculDistanceUtils';
import { logoUrl, BIKE_NAME } from '../shared/logoUrl';

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
  logoVehicles: string[];
  tabProviders: any;

  constructor(private geoLocation: Geolocation, private vehicleService: VehicleService) { }

  ionViewDidEnter() {
    this.initCustomLogo();
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

      // TO DO : Before merge to master set the current user location
      this.getVehicles(48.866667, 2.333333); // les coords sont en dur car de chez moi il n'y a pas de trottinette
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '&copy; <a href="https://www.mapbox.com/">MapBox</a> contributors',
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiaG93MmdvIiwiYSI6ImNrNWdqdDd2MTA2aDMzbm1wdnFnZWtlcmIifQ.TYERgnbQiVw246ni5xrH8g'

    }).addTo(this.map);
  }

  addMarkers() {
    this.vehicles.forEach(v => this.addMarker(v.lat, v.lng));
  }
  addMarker(lat: number, long: number) {
    marker([lat, long], { icon: this.customMarkerIcon }).bindPopup('I am here').addTo(this.map);
  }

  private getVehicles(lat: number, long: number) {
    this.vehicleService.getVehicles(long, lat)
      .subscribe(({ data }) => {
        this.vehicles = data.vehicles;
        this.addMarkers();
        CalculDistance.distanceCalculator(long, lat, this.vehicles);
        this.addLogoToVehicle(this.vehicles);
      });
  }

  private addLogoToVehicle(vehicles: Vehicle[]) {
    for (const v of vehicles) {
      const index = BIKE_NAME.indexOf(v.provider.name);
      if (this.logoVehicles[index]) {
        v.provider.url = this.logoVehicles[index];
      } else {
        v.provider.url = 'https://i.ibb.co/vh5cXXJ/marker-icon-red.png';
      }
    }
  }

  private initCustomLogo() {
    let logos: string[];
    logos = logoUrl;
    this.logoVehicles = logoUrl;

  }
  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }
}
