import {Component, Input, OnInit} from '@angular/core';
import {VehicleListQueryService} from '../vehicle-list-query.service';
import {Vehicle} from '../vehicle';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  @Input() vehicles: Vehicle[];
  @Input() filteredVehicles: Vehicle[];
  @Input() isFiltered: string;

  constructor(private vehicleListQueryService: VehicleListQueryService) { }

  ngOnInit() {
  }

  sortDistance() {
    this.vehicles.sort((a: Vehicle, b: Vehicle) => (a.distance > b.distance) ? 1 : -1);
  }

  sortType() {
    this.vehicles.sort((a: Vehicle, b: Vehicle) => (a.provider.name > b.provider.name) ? 1 : -1);
  }


}
