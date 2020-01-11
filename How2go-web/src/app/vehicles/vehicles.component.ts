import { Component, OnInit } from '@angular/core';
import { PositionService } from '../position.service';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  vehicles: any[];
  limes: any[];

  constructor(private positionService: PositionService, private apollo: Apollo) { }

  ngOnInit() {
    // récupère les véhicules
    this.positionService.getVehicles(2.335471, 48.863341)
      .pipe(map(({ data }) => this.vehicles = data.vehicles));

  }

  // On recupere les limes de notre tableau de trotinette
  getLime() {
    // methode pour mapper des elements d'une liste
    this.limes = this.vehicles.map(v => v.provider.name === 'Lime');
  }

}
