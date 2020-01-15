import { Component, Input, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input() vehicles: Vehicle[];
  logo = '../../../assets/images/lime.jpg';

  bird: Vehicle[];
  bolt: Vehicle[];
  bMobility: Vehicle[];
  circ: Vehicle[];
  cityscoot: Vehicle[];
  dott: Vehicle[];
  jump: Vehicle[];
  lime: Vehicle[];
  mobike: Vehicle[];
  tier: Vehicle[];
  velib: Vehicle[];
  voi: Vehicle[];
  wind: Vehicle[];
  

  vehicleName: string[];

  constructor() { }

  ngOnInit() {
    this.getBikesByBrand();
    this.vehicleName = this.getVehicleName();
  }

  getBikesByBrand() {
    this.getBird();
    this.getBolt();
    this.getBMobility();
    this.getCirc();
    this.getCityscoot();
    this.getDott();
    this.getJump();
    this.getLime();
    this.getMobike();
    this.getTier();
    this.getVelib();
    this.getVoi();
    this.getWind();
  }

  getTabByName(name: string): Vehicle[] {
    switch (name) {
      case 'Bird':
        return this.bird;
        break;
      case 'Bolt':
        return this.bolt;
        break;
      case 'B Mobility':
        return this.bMobility;
        break;
      case 'Circ':
        return this.circ;
        break;
      case 'Cityscoot':
        return this.cityscoot;
        break;
      case 'Dott':
        return this.dott;
        break;
      case 'Jump':
        return this.jump;
        break;
      case 'Mobike':
        return this.mobike;
        break;
      case 'Tier':
        return this.tier;
        break;
      case 'Velib':
        return this.velib;
        break;
      case 'Voi':
        return this.voi;
        break;
      case 'Wind':
        return this.wind;
        break;
      default:
        return [];
        break;
    }
  }

  private getBird() {
    this.bird = this.filterByName('Bird');
  }
  private getBolt() {
    this.bolt = this.filterByName('Bolt');
  }
  private getBMobility() {
    this.bMobility = this.filterByName('B Mobility');
  }
  private getCirc() {
    this.circ = this.filterByName('Circ');
  }
  private getCityscoot() {
    this.cityscoot = this.filterByName('Cityscoot');
  }
  private getDott() {
    this.dott = this.filterByName('Dott');
  }
  private getJump() {
    this.jump = this.filterByName('Jump');
  }
  private getLime() {
    this.lime = this.filterByName('Lime');
  }
  private getMobike() {
    this.mobike = this.filterByName('Mobike');
  }
  private getTier() {
    this.tier = this.filterByName('Tier');
  }
  private getVelib() {
    this.velib = this.filterByName('Velib');
  }
  private getVoi() {
    this.voi = this.filterByName('Voi');
  }
  private getWind() {
    this.wind = this.filterByName('Wind');
  }

  private filterByName(vehicleName: string): Vehicle[] {
    return this.vehicles.filter(v => v.provider.name === vehicleName);
  }

  private getVehicleName(): string[] {
    const names: string[] = [];
    this.vehicles.forEach(v => {
      if (!(names.find(n => n === v.provider.name))) {
        names.push(v.provider.name);
      }
    });
    return names;
  }



}
