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
  private addMarkers(vehicles: Vehicle[]) {
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
    vehicles.forEach(point => {
      const index = this.tabProviders.indexOf(point.provider.name);
      if (this.markers[index]) {
        this.myIcon.options.iconUrl = this.markers[index];
      } else {
        this.myIcon.options.iconUrl = 'https://i.ibb.co/vh5cXXJ/marker-icon-red.png'
      }
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
    });
  }

  // remove all the markers in one go
  private removeMarkers() {
    this.layerGroup.clearLayers();
  }
}
