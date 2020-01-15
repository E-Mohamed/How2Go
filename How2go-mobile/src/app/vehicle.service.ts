import { Injectable } from '@angular/core';
import { Vehicle } from '../app/models/vehicle.model';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})

export class VehicleService extends Query<{ vehicles: Vehicle[] }>  {
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
