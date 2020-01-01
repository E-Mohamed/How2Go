import { Component, OnInit } from '@angular/core';
import {PositionService} from "../position.service";
import {Apollo} from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  vehicles: Observable<any>;

  constructor(private positionService: PositionService, private apollo: Apollo) { }

  ngOnInit() {
    //récupère les véhicules
    this.vehicles = this.positionService.getVehicles().pipe(map(({data}) => data.vehicles));
  }

}
