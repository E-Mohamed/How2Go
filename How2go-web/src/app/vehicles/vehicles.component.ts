import {Component, Input, OnInit} from '@angular/core';
import {VehicleListQueryService} from '../vehicle-list-query.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  @Input() vehicles: any[];
  limes: any[];

  constructor(private vehicleListQueryService: VehicleListQueryService) { }

  ngOnInit() {

  }

  // On recupere les limes de notre tableau de trotinette
  getLime() {
    // methode pour mapper des elements d'une liste
    this.limes = this.vehicles.map(v => v.provider.name === 'Lime');
  }

}
