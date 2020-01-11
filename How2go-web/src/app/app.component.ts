import { Component } from '@angular/core';
import * as map from 'leaflet';
import { PositionService } from './position.service';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {FormControl} from '@angular/forms';
import {Marker} from 'leaflet';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'How2go-web';

  myIcon = map.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
  });

  /* COORDONNEES DE LA GEOLOCALISATION */
  longitude;
  latitude;

  /* MAP */
  myMap;
  layerGroup;

  geolocationAuthorized = false;

  /* BARRE RECHERCHE DE LIEUX */
  private search: FormControl;

  /* LISTE DES MOYENS DE TRANSPORT*/
  vehicles: any;

  cities: any;

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    /*** AVEC GEOLOCALISATION ***/
    this.initMapGeolocation();
    //this.addTrotinetteMarkers();
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
  private getVehicles(longitude, latitude) {
    this.positionService.getVehicles(longitude, latitude).subscribe(vehicle => {
      this.vehicles = vehicle.data.vehicles;
      this.addMarkers();
      console.log(vehicle.data.vehicles);
    });
  }

  /* GESTION MARKERS */
  private addMarkers() {
    this.removeMarkers();
    for (let point of this.vehicles) {
      // create markers
      map.marker(
        [
          point.lat,
          point.lng
        ],
        { icon: this.myIcon }).bindPopup(point.provider.name).addTo(this.layerGroup);
    }
  }

  // remove all the markers in one go
  private removeMarkers() {
    this.layerGroup.clearLayers();
  }
  /******************/

  private addTrotinetteMarkers() {
    this.positionService.getPos().subscribe((data: any) => {
      data.records.forEach(point => {
        map.marker(
          [
            point.geometry.coordinates[1],
            point.geometry.coordinates[0]
          ],
          { icon: this.myIcon }
        ).bindPopup('bla bla de la trottinette')
          .addTo(this.myMap);
      });
    });
  }

  // autocomplétion des villes
  keyupCallback() {
    const provider = new OpenStreetMapProvider();
    provider.search({ query: this.search.value }).then((results) => {
      this.cities = results;
    });
  }

  // change la position de la carte -> click sur le nom d'une ville
  changePosition(city) {
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

}

