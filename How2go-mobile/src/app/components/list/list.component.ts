import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../vehicle.service';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  vehicles: any;
  logo = '../../../assets/images/lime.jpg';
  dist: number;

  constructor(private vehicleService: VehicleService, private apollo: Apollo) { }

  ngOnInit() {
    // récupère les véhicules
    this.getVehicle();
  }

  getVehicle() {
    this.vehicleService.getVehicles(2.335471, 48.863341)
      .subscribe((data: any) => {this.vehicles = data.vehicles;
      });

  }


  calculDistance(latUser: number, longUser: number, latVehicle: number, longVehicle: number) {

  }

 /*private addVehicleMarkersGeolocation() {
    this.vehicleService.getVehicles(2.335471, 48.863341).subscribe((vehicle: any) => {
      for (let point of vehicle.data.vehicles) {
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

  }*/

}
