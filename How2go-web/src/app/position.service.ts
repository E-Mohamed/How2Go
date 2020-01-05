import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

export interface LimeBike {
  long: string;
  lat: string;
  batteryLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  currentLat: any;
  currentLong: any;
  //requête de base qui renvoie tous les véhicules
  query = gql`
          query ($lat: Float!, $lng: Float!) {
            vehicles (lat: $lat, lng: $lng) {
              id
              type
              attributes
              lat
              lng
              provider {
                name
              }
            }
          }
        `;

  constructor(
    private http: HttpClient,
    private apollo: Apollo
    ) { }

  /* FONCTIONS POUR RETROUVER LA POSITION DE L'UTILISATEUR */
  trackMe() {
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });

  }

  showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
  }
  /******************************/

  //retourne les véhicules
  getVehicles(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: this.query,
        variables: {
          "lat": 48.863341, // c'est ici qu'on renseigne la position que l'on souhaite
          "lng": 2.335471
        }
      })
      .valueChanges;
  }
}
