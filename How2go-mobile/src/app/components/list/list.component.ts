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

  vehicles: Observable<any>;
  logo = '../../image/lime.jpg';

  constructor(private vehicleService: VehicleService, private apollo: Apollo) { }

  ngOnInit() {
    // récupère les véhicules
    this.getVehicle();
   }

  getVehicle() {
    this.vehicles = this.vehicleService.getVehicles(2.335471, 48.863341).pipe(map(({ data }) => data.vehicles));

  }

}
