import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
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
  // requête de base qui renvoie tous les véhicules
  // TO DO : Créer une constante dans un fichier partager et recuperer la requête depuis le fichier
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

  // TO DO : Delete if not use
  /*
  getPos(): Observable<any> {
    const url = 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=bornes-podotactiles';
    return this.http
      .get<any>(url)
      .pipe();
  }*/

  // retourne les véhicules
  getVehicles(longitude: number, latitude: number): Observable<any> {
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
