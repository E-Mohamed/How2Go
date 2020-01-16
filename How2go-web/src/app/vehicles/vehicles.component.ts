import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {VehicleListQueryService} from '../vehicle-list-query.service';
import {Vehicle} from '../vehicle';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  @Input() vehicles: Vehicle[];
  @Input() vehicleTypes: string[];
  @Input() filteredVehicles: Vehicle[];
  @Input() isFiltered: boolean;
  @Output() filterEvent = new EventEmitter<string>();
  @Output() unfilterEvent = new EventEmitter<string>();
  @Output() centerEvent = new EventEmitter<Vehicle>();

  callFilter(v) {
    this.filterEvent.next(v);
  }

  callUnfilter() {
    this.unfilterEvent.next();
  }

  callParent(v){
    this.centerEvent.emit(v);
  }
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
