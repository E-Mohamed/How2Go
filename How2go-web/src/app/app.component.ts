import { Component } from '@angular/core';
import * as map from 'leaflet';
import { PositionService } from './position.service';



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

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    /*** AVEC GEOLOCALISATION ***/
    this.initMapGeolocation();

    /*** TEST AVEC UNE POSITION SUR PARIS (commenter les deux lignes ci-dessus) ***/
    /*  this.initMap();
        this.addVehicleMarkers(); */

    this.addTrotinetteMarkers();
  }


  /* CRÉE ET INITIALISE UNE MAP GEOLOCALISEE */
  private initMapGeolocation(){

//    if (navigator.geolocation) {
  //    navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = 2.3524;
        this.latitude = 48.8605;
        this.myMap = map.map('map').setView([this.latitude,this.longitude], 20);
        map
          .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
          })
          .addTo(this.myMap);             
        this.addVehicleMarkersGeolocation();
    //  });
    //}


  }

  /* CRÉE ET INITIALISE UNE MAP NON GEOLOCALISEE */
  private initMap(){
    this.myMap = map.map('map').setView([48.819131,2.320939], 20);
    map
      .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
      })
      .addTo(this.myMap);
  }
  
  private linkApplication(name): string{
    
    let userAgent = navigator.userAgent.toLowerCase(); 
    let isAndroid = userAgent.indexOf("android") > -1; 
    let isWindows = userAgent.indexOf("windows") > -1;     
    let isMac = userAgent.indexOf("mac") > -1;
    let isIphone = userAgent.indexOf("iphone") > -1;
    if(isAndroid || isIphone){
      return name+'://';
    }
    if(isWindows || isMac){
      return 'https://www.google.com/search?q='+name;
    }
  
  }

  /* AJOUTE LES MARKERS DES MOYENS DE LOCOMOTION GEOLOCALISES */
  private addVehicleMarkersGeolocation(){
    this.positionService.getVehicles(this.longitude,this.latitude).subscribe((vehicle:any) => {
      for(let point of vehicle.data.vehicles){
        let link = this.linkApplication(point.provider.name);
        map.marker(
          [
            point.lat,
            point.lng
          ],
          { icon: this.myIcon }
        ).bindPopup('<a type="submit" href="'+link+'" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">'+point.provider.name+'</a></br>')
          .addTo(this.myMap);
      }      
    })

  }

  /* AJOUTE LES MARKERS DES MOYENS DE LOCOMOTION NON GEOLOCALISES */
  private addVehicleMarkers(){
    this.positionService.getVehicles(2.320939,48.819131).subscribe((vehicle:any) => {
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

}
