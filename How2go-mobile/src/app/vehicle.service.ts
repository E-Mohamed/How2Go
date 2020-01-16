import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

export interface LimeBike {
  long: string;
  lat: string;
  batteryLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  currentLat: any;
  currentLong: any;
  // requête de base qui renvoie tous les véhicules
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
    private apollo: Apollo
  ) { }


  // retourne les véhicules
  getVehicles(longitude: any, latitude: any): Observable<any> {
    return this.apollo
      .watchQuery({
        query: this.query,
        variables: {
          "lat": latitude, // c'est ici qu'on renseigne la position que l'on souhaite
          "lng": longitude
        }
      })
      .valueChanges;
  }
}
