import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as map from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Vehicle } from './vehicle';
import { VehicleListQueryService } from './vehicle-list-query.service';
import CalculateDistance from './shared/CalculateDistanceUtils';
import { LOGO_ICON, MARKER_ICON, BIKE_NAME } from '../app/shared/imagesUrl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'How2go-web';

  myIcon = map.icon({
    iconUrl: 'https://i.ibb.co/tJvMGCc/current-position.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
  });

  /* LISTE DES MARKERS */
  markers: string[];
  tabProviders: string[];

  logoVehicles: string[];

  /* COORDONNEES DE LA GEOLOCALISATION */
  longitude: number;
  latitude: number;

  /* MAP */
  myMap: any;
  layerGroup: any;

  geolocationAuthorized = false;

  /* BARRE RECHERCHE DE LIEUX */
  private search: FormControl;

  /* LISTE DES MOYENS DE TRANSPORT*/
  vehicles: Vehicle[];

  cities: any;

  /* FILTRES VEHICLES */
  filteredVehicles: Vehicle[];
  isFiltered = false;
  vehicleTypes: string[];

  constructor(private vehicleListQueryService: VehicleListQueryService) {
  }

  ngOnInit() {
    /*** AVEC GEOLOCALISATION ***/
    this.initTabVehicles();
    this.initCustomMarkers();
    this.initCustomLogo();
    this.initMapGeolocation();
    this.search = new FormControl();
  }


  // autocomplétion des villes
  keyupCallback() {
    const provider = new OpenStreetMapProvider();
    provider.search({ query: this.search.value }).then((results) => {
      this.cities = results;
    });
  }

  // change la position de la carte -> click sur le nom d'une ville
  changePosition(city: any) {
    // si la géolocalisation n'est pas autorisée => réinitialisation de la map
    if (!this.geolocationAuthorized) {
      this.initMap(city.y, city.x);
    } else {
      this.myMap.setView(new map.LatLng(city.y, city.x));
      this.getVehicles(city.x, city.y);
    }

  }

  // change la position de la carte -> géolocalisation
  changePositionGeolocation() {
    this.myMap.setView(new map.LatLng(this.latitude, this.longitude));
    this.getVehicles(this.longitude, this.latitude);
    this.myIcon.options.iconUrl = 'https://i.ibb.co/tJvMGCc/current-position.png'
    map.marker(
      [
        this.latitude,
        this.longitude
      ],
      { icon: this.myIcon }).addTo(this.layerGroup);
  }

  // filtre les véhicules
  filterVehicles(type: string) {
    this.isFiltered = true;
    this.filteredVehicles = this.vehicles.filter(value => value.provider.name === type);
    this.removeMarkers();
    this.addMarkers(this.filteredVehicles);
  }

  // reset les filtres
  resetFilter() {
    this.isFiltered = false;
    this.removeMarkers();
    this.addMarkers(this.vehicles);
  }

  /* CRÉE ET INITIALISE UNE MAP GEOLOCALISEE */
  private initMapGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.geolocationAuthorized = true;

        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.myMap = map.map('map').setView([this.latitude, this.longitude], 20);
        map
          .tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoiaG93MmdvIiwiYSI6ImNrNWdqdDd2MTA2aDMzbm1wdnFnZWtlcmIifQ.TYERgnbQiVw246ni5xrH8g'
          })
          .addTo(this.myMap);

        this.layerGroup = map.layerGroup().addTo(this.myMap);

        this.getVehicles(this.longitude, this.latitude);
      });
    }
  }

  /* CRÉE ET INITIALISE UNE MAP NON GEOLOCALISEE */
  private initMap(latitude: number, longitude: number) {
    this.myMap = map.map('map').setView([latitude, longitude], 20);
    map
      .tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiaG93MmdvIiwiYSI6ImNrNWdqdDd2MTA2aDMzbm1wdnFnZWtlcmIifQ.TYERgnbQiVw246ni5xrH8g'
      })
      .addTo(this.myMap);

    this.layerGroup = map.layerGroup().addTo(this.myMap);
    this.getVehicles(longitude, latitude);
  }

  /* RETOURNES LES MOYENS DE TRANSPORT */
  private getVehicles(longitude: number, latitude: number) {
    this.vehicleListQueryService.fetch({
      lat: latitude,
      lng: longitude
    }).subscribe(({ data }) => {
      this.vehicles = data.vehicles;
      this.putLogo(data.vehicles);
      this.addMarkers(data.vehicles);
      CalculateDistance.distanceCalculator(longitude, latitude, this.vehicles);
      // types de véhicule => filtres
      this.vehicleTypes = Array.from(new Set(this.vehicles.map(v => v.provider.name)));
    });
  }

  private initTabVehicles() {
    this.tabProviders = BIKE_NAME;
  }


  private initCustomMarkers() {
    let iconUrl: string[];
    iconUrl = MARKER_ICON;
    this.markers = iconUrl;
  }

  private initCustomLogo() {
    this.logoVehicles = LOGO_ICON;
  }

  private putLogo(vehicles: Vehicle[]) {
    vehicles.forEach(v => {
      const index = this.tabProviders.indexOf(v.provider.name);
      if (this.logoVehicles[index]) {
        v.provider.url = this.logoVehicles[index];
      } else {
        v.provider.url = 'https://i.ibb.co/vh5cXXJ/marker-icon-red.png';
      }
    });
  }

  /* GESTION MARKERS */
  private addMarkers(vehicles: Vehicle[]) {
    this.removeMarkers();
    map.marker(
      [
        this.latitude,
        this.longitude
      ],
      { icon: this.myIcon }).addTo(this.layerGroup);

    vehicles.forEach(point => {
      const index = this.tabProviders.indexOf(point.provider.name);
      if (this.markers[index]) {
        this.myIcon.options.iconUrl = this.markers[index];
      } else {
        this.myIcon.options.iconUrl = 'https://i.ibb.co/vh5cXXJ/marker-icon-red.png'
      }
      map.marker(
        [
          point.lat,
          point.lng
        ],
        { icon: this.myIcon }).bindPopup(point.provider.name).addTo(this.layerGroup);
    });
  }

  // remove all the markers in one go
  private removeMarkers() {
    this.layerGroup.clearLayers();
  }
}
