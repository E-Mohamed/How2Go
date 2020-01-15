import { Component, OnInit, Input } from '@angular/core';
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

  @Input() vehicles: Vehicle[];
  logo = '../../../assets/images/lime.jpg';

  lime: Vehicle[];
  velib: Vehicle[];
  tier: Vehicle[];
  circ: Vehicle[];
  bird: Vehicle[];
  cityscoot: Vehicle[];

  constructor() { }

  ngOnInit() {
    this.getLime();
    this.getBird();
  }

  getLime() {
    this.lime = this.filterByName('Lime');
    console.log(this.lime);
  }
  getBird() {
    this.bird = this.filterByName('Bird');
    console.log(this.bird);
  }

  private filterByName(vehicleName: string): Vehicle[] {
    return this.vehicles.filter(v => v.provider.name === vehicleName);
  }

  private getVehicleName(): string[] {
    let names: string[];
    return null
  }
}
