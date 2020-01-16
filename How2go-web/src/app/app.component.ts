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
    //if (navigator.geolocation) {
      //navigator.geolocation.getCurrentPosition((position) => {
        this.geolocationAuthorized = true;

        //this.longitude = position.coords.longitude;
        this.longitude = 2.36481;
        //this.latitude = position.coords.latitude;
        this.latitude = 48.8269;
        this.myMap = map.map('map').setView([this.latitude, this.longitude], 20);
        map
          .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
          })
          .addTo(this.myMap);

        this.layerGroup = map.layerGroup().addTo(this.myMap);

        this.getVehicles(this.longitude, this.latitude);
      //});
    //}
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

  private linkWebSite(name): string{
    //ce tableau contient les liens des site web
    let linksWebSite = {
      "Bird" : `https://www.bird.co/`,
      "Bolt":`https://bolt.eu/`, 
      "B Mobility":`https://bmobility.fr/`,
      "Circ":`https://goflash.com/`,
      "Cityscoot":`https://www.cityscoot.eu/`,
      "Dott":`https://ridedott.com/`,
      "Jump":`https://www.jump.com/`,
      "Mobike":`https://mobike.com/`,
      "Tier":`https://www.tier.app/`,
      "Velib":`https://www.velib-metropole.fr/`,
      "Voi":`https://www.voiscooters.com/`,
      "Wind":`https://www.wind.co`,
      "Lime":`https://www.li.me/fr/page-daccueil`,
    };
    return linksWebSite[name];
  }

  private linkAppStore(name): string{
    //ce tableau contient les liens des applications sur app store
    let linksAppStore = {
      "Bird" : `itms-apps://apps.apple.com/fr/app/bird-soyez-libre-bon-voyage/id1260842311`,
      "Bolt":`itms-apps://apps.apple.com/fr/app/bolt-txfy/id675033630`, 
      "B Mobility":`itms-apps://apps.apple.com/fr/app/b-mobility-trottinettes/id1463869749`,
      "Circ":`itms-apps://apps.apple.com/fr/app/circ-trottinettes-électrique/id1446543957`,
      "Cityscoot":`itms-apps://apps.apple.com/fr/app/cityscoot/id1011202160`,
      "Dott":`itms-apps://apps.apple.com/fr/app/dott/id1440301673`,
      "Jump":`itms-apps://apps.apple.com/fr/app/uber/id368677368`,
      "Mobike":`itms-apps://apps.apple.com/fr/app/mobike-global/id1479165334`,
      "Tier":`itms-apps://apps.apple.com/fr/app/tier-scooter-sharing/id1436140272`,
      "Velib":`itms-apps://apps.apple.com/fr/app/vélib-app-officielle/id577807727`,
      "Voi":`itms-apps://apps.apple.com/fr/app/voi-scooters-get-magic-wheels/id1395921017`,
      "Wind":`itms-apps://apps.apple.com/fr/app/wind-electric-scooter-share/id1247826304`,
      "Lime":`itms-apps://apps.apple.com/fr/app/lime-déplacez-vous-sans-limi/id1199780189`
    };
    return linksAppStore[name];
  }

  private linkGooglePlay(name): string{
    //ce tableau contient les liens des applications sur google play
    let linksGooglePlay = {
      "Bird" : `market://details?id=co.bird.android`,
      "Bolt":`market://details?id=ee.mtakso.client`, 
      "B Mobility":`market://details?id=com.dufercoenergia.dmobility`,
      "Circ":`market://details?id=com.goflash.consumer`,
      "Cityscoot":`market://details?id=com.livebanner.cityscoot`,
      "Dott":`market://details?id=com.ridedott.rider`,
      "Jump":`market://details?id=com.jumpmobility&hl=fr`,
      "Mobike":`market://details?id=com.mobike.global`,
      "Tier":`market://details?id=com.tier.app`,
      "Velib":`market://details?id=com.paris.velib`,
      "Voi":`market://details?id=io.voiapp.voi`,
      "Wind":`market://details?id=com.zen.zbike`,
      "Lime":`market://details?id=com.limebike`
    };        
    return linksGooglePlay[name];    
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
    let userAgent = navigator.userAgent.toLowerCase(); 
    let isAndroid = userAgent.indexOf("android") > -1; 
    let isIphone = userAgent.indexOf("iphone") > -1;
    let link = '';
    for (const point of this.vehicles) {
      // create markers
      const index = this.tabProviders.indexOf(point.provider.name);
      this.myIcon.options.iconUrl = this.markers[index];

      if(isAndroid || isIphone){ //si le device est un smartphone
        if(isAndroid)//si android on retourne le lien de l'appli sur google play
          link = this.linkGooglePlay(point.provider.name);
        else //si iphone on retourne le lien de l'appli sur app store        
          link = this.linkAppStore(point.provider.name);
          map.marker(
            [
              point.lat,
              point.lng
            ],
            {icon: this.myIcon}).bindPopup('<button value="'+link+'" onclick="location.href = this.value;">'+point.provider.name+'</button></br>').addTo(this.layerGroup);                    
      }
      else{//autre type device on retourne le lien de site web
        link = this.linkWebSite(point.provider.name);  
        map.marker(
          [
            point.lat,
            point.lng
          ],
          {icon: this.myIcon}).bindPopup('<button id="_blank" value="'+link+'" onclick="window.open(this.value, this.id);">'+point.provider.name+'</button></br>').addTo(this.layerGroup);                
      }        
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
