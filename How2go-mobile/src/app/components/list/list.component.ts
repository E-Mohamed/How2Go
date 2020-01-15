import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../vehicle.service';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  vehicles: Vehicle[];
  logo = '../../../assets/images/lime.jpg';

  constructor(private vehicleService: VehicleService, private apollo: Apollo) { }

  ngOnInit() {
    // récupère les véhicules
    this.getVehicles();
   }

  getVehicles() {
    this.vehicleService.getVehicles(2.335471, 48.863341)
      .subscribe(({ data }) => this.vehicles = data.vehicles);

  }

}
