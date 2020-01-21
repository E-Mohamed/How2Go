import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as map from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Vehicle } from '../../vehicle';
import { VehicleListQueryService } from '../../vehicle-list-query.service';
import CalculateDistance from '../../shared/CalculateDistanceUtils';
import {
  LOGO_ICON, MARKER_ICON,
  BIKE_NAME, WEB_SITE_URL,
  APP_STORE_LINK, GOOGLE_PLAY_LINK
} from '../../shared/imagesUrl';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  myIcon = map.icon({
    iconUrl: 'https://i.ibb.co/tJvMGCc/current-position.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]
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
  search: FormControl;

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
    this.myIcon.options.iconUrl = 'https://i.ibb.co/tJvMGCc/current-position.png';
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
    this.centerMap(this.filteredVehicles[0]);
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
        v.provider.url = 'https://i.ibb.co/MSb0YWX/default.png';
      }
    });
  }

  private linkWebSite(name: string): string {
    return WEB_SITE_URL[name];
  }

  private linkAppStore(name: string): string {
    return APP_STORE_LINK[name];
  }

  private linkGooglePlay(name: string): string {
    return GOOGLE_PLAY_LINK[name];
  }

  /* GESTION MARKERS */
  private addMarkers(vehicles: Vehicle[]) {
    this.removeMarkers();
    this.myIcon.options.iconUrl = 'https://i.ibb.co/tJvMGCc/current-position.png';
    map.marker(
      [
        this.latitude,
        this.longitude
      ],
      { icon: this.myIcon }).addTo(this.layerGroup);
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.indexOf('android') > -1;
    const isIphone = userAgent.indexOf('iphone') > -1;
    let link = '';
    vehicles.forEach(point => {
      const index = this.tabProviders.indexOf(point.provider.name);
      if (this.markers[index]) {
        this.myIcon.options.iconUrl = this.markers[index];
      } else {
        this.myIcon.options.iconUrl = 'https://i.ibb.co/6FqZhvx/default-pin.png';
      }
      if (isAndroid || isIphone) { // si le device est un smartphone
        if (isAndroid) {// si android on retourne le lien de l'appli sur google play
          link = this.linkGooglePlay(point.provider.name);
        } else { // si iphone on retourne le lien de l'appli sur app store
          link = this.linkAppStore(point.provider.name);
        }
        map.marker(
          [
            point.lat,
            point.lng
          ],
          { icon: this.myIcon })
          .bindPopup('<button value="' + link + '" onclick="location.href = this.value;">'
            + point.provider.name + '</button></br>')
          .addTo(this.layerGroup);
      } else {// autre type device on retourne le lien de site web
        link = this.linkWebSite(point.provider.name);
        map.marker(
          [
            point.lat,
            point.lng
          ],
          { icon: this.myIcon })
          .bindPopup('<button id="_blank" value="' + link + '" onclick="window.open(this.value, this.id);">'
            + point.provider.name + '</button></br>')
          .addTo(this.layerGroup);
      }
    });
  }

  // remove all the markers in one go
  private removeMarkers() {
    this.layerGroup.clearLayers();
  }

  centerMap(v: Vehicle) {
    this.myMap.panTo(new map.LatLng(v.lat, v.lng));

  }
}
