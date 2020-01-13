import { Injectable } from '@angular/core';
import {Vehicle} from './vehicle';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})

export class VehicleListQueryService extends Query<{ vehicles: Vehicle[] }>  {
  document = gql`
          query VehicleList ($lat: Float!, $lng: Float!) {
            vehicles (lat: $lat, lng: $lng) {
              id
              type
              lat
              lng
              provider {
                name
              }
            }
          }
        `;
}
