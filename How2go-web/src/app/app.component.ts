import { Component } from '@angular/core';
import * as map from 'leaflet';
import { PositionService } from './position.service';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {FormControl} from '@angular/forms';



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

  longitude;
  latitude;
  myMap;
  private search: FormControl;
  cities: any;

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    /*** AVEC GEOLOCALISATION ***/
    this.initMapGeolocation();
    this.addTrotinetteMarkers();
    this.search = new FormControl();
  }


  /* CRÉE ET INITIALISE UNE MAP GEOLOCALISEE */
  private initMapGeolocation(){

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.myMap = map.map('map').setView([this.latitude,this.longitude], 20);
        map
          .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
          })
          .addTo(this.myMap);
        this.addVehicleMarkersGeolocation();


      });
    }


  }

  /* AJOUTE LES MARKERS DES MOYENS DE LOCOMOTION GEOLOCALISES */
  private addVehicleMarkersGeolocation(){
    this.positionService.getVehicles(this.longitude,this.latitude).subscribe((vehicle:any) => {
      for(let point of vehicle.data.vehicles){
        map.marker(
          [
            point.lat,
            point.lng
          ],
          { icon: this.myIcon }
        ).bindPopup(point.provider.name)
          .addTo(this.myMap);
      }
    })

  }

  /* AJOUTE LES MARKERS DES MOYENS DE LOCOMOTION NON GEOLOCALISES */
  private addVehicleMarkers(longitude,latitude){
    this.positionService.getVehicles(longitude,latitude).subscribe((vehicle:any) => {
      for(let point of vehicle.data.vehicles){
        //console.log(point);
        map.marker(
          [
            point.lat,
            point.lng
          ],
          { icon: this.myIcon }
        ).bindPopup(point.provider.name)
          .addTo(this.myMap);
      }
    });
  }


  private addTrotinetteMarkers(){
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
    this.myMap.setView(new map.LatLng(city.y, city.x));
    this.addVehicleMarkers(city.x, city.y);
  }

  // change la position de la carte -> géolocalisation
  changePositionGeolocation(){
    this.myMap.setView(new map.LatLng(this.latitude, this.longitude));
    this.addVehicleMarkers(this.longitude, this.latitude);
  }

}
