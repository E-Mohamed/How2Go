import {Component, Output} from '@angular/core';
import * as map from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {FormControl} from '@angular/forms';
import {icon, Marker} from 'leaflet';
import {Vehicle} from './vehicle';
import {VehicleListQueryService} from './vehicle-list-query.service';
import {moveCursor} from 'readline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'How2go-web';

  myIcon = map.icon({
    iconUrl: 'https://multicycles.org/img/mobike-2x.40d9c66f.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
  });

  /* LISTE DES MARKERS */
  markers: string[];
  tabProviders: string[];

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

  constructor(private vehicleListQueryService: VehicleListQueryService) {
  }

  ngOnInit() {
    /*** AVEC GEOLOCALISATION ***/
    this.initCustomMarkers();
    this.initMapGeolocation();
    this.search = new FormControl();
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
          .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
          })
          .addTo(this.myMap);

        this.layerGroup = map.layerGroup().addTo(this.myMap);

        this.getVehicles(this.longitude, this.latitude);
      });
    }
  }


  /* CRÉE ET INITIALISE UNE MAP NON GEOLOCALISEE */
  private initMap(latitude, longitude) {
    this.myMap = map.map('map').setView([latitude, longitude], 20);
    map
      .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
      })
      .addTo(this.myMap);

    this.layerGroup = map.layerGroup().addTo(this.myMap);
    this.getVehicles(longitude, latitude);
  }

  /* RETOURNES LES MOYENS DE TRANSPORT */
  private getVehicles(longitude: number, latitude: number) {
    this.vehicleListQueryService.fetch({
      lat: latitude, // c'est ici qu'on renseigne la position que l'on souhaite
      lng: longitude
    }).subscribe(({data}) => {
      this.vehicles = data.vehicles;
      this.addMarkers();
      this.distanceCalculator(longitude, latitude);
    });
  }

  private initCustomMarkers() {
    console.log("test");
    let iconUrl: string[];
    iconUrl = ['https://i.ibb.co/DRJnK3v/birdlogo.png',
      'bolt-placeholder',
      'https://i.ibb.co/YN27vmd/bmobilitylogo.png',
      'https://i.ibb.co/FgDtnky/circlogo.png',
      'https://multicycles.org/img/cityscoot-2x.48f6bda8.png',
      'https://i.ibb.co/HX5QQMB/dottlogo.png',
      'https://i.ibb.co/4VGtjXm/jumplogo.png',
      'https://multicycles.org/img/mobike-2x.40d9c66f.png',
      'https://multicycles.org/img/tier-2x.e6d1964e.png',
      'https://i.ibb.co/sRC0Rcx/veliblogo.png',
      'https://i.ibb.co/xMBBB7r/voilogo.png',
      'wind-placeholder'];
    this.markers = iconUrl;

  }

  /* GESTION MARKERS */
  private addMarkers() {
    let fillTab: string[];
    fillTab = ["Bird", "Bolt", "B Mobility", "Circ", "Cityscoot", "Dott", "Jump", "Mobike", "Tier", "Velib", "Voi", "Wind"];
    this.tabProviders = fillTab;
    this.removeMarkers();
    map.marker(
      [
        this.latitude,
        this.longitude
      ],
      { icon: this.myIcon }).addTo(this.layerGroup);
    for (const point of this.vehicles) {
      // create markers
      const index = this.tabProviders.indexOf(point.provider.name);
      this.myIcon.options.iconUrl = this.markers[index];
      map.marker(
        [
          point.lat,
          point.lng
        ],
        {icon: this.myIcon}).bindPopup(point.provider.name).addTo(this.layerGroup);
    }
  }

  // remove all the markers in one go
  private removeMarkers() {
    this.layerGroup.clearLayers();
  }

  /******************/


  // autocomplétion des villes
  keyupCallback() {
    const provider = new OpenStreetMapProvider();
    provider.search({query: this.search.value}).then((results) => {
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
  }

  private distanceCalculator(lon1, lat1) {
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
    this.orderVehicles();
  }

  private orderVehicles() {
    this.vehicles.sort((a: Vehicle, b: Vehicle) => (a.distance > b.distance) ? 1 : -1);
  }
}
