import { Component, Input, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  // Lat Long from parent component
  @Input() vehicles: Vehicle[];
  limes: Vehicle[];
  velibs: Vehicle[];

  logo = '../../../assets/images/lime.jpg';

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((pos) => {
      console.log(pos.coords.latitude);
      console.log(pos.coords.longitude);

      console.log(this.calculDistance(pos.coords.latitude, pos.coords.longitude, 48.866667, 2.333333));
    });

  }

  getLimes() {
    this.limes = this.vehicles.filter(lime => lime.provider.name === 'Lime');
    // this.limes.sort() to sort by distance
  }

  getVelib() {
    this.velibs = this.vehicles.filter(velib => velib.provider.name === 'Velib');
  }

  calculDistance(latUser: number, longUser: number, latVehicle: number, longVehicle: number): number {
    if ((latUser === latVehicle) && (longUser === longVehicle)) {
      return 0;
    } else {
      const radlatUser = Math.PI * latUser / 180;
      const radlatVehicle = Math.PI * latVehicle / 180;
      const theta = longUser - longVehicle;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlatUser) * Math.sin(radlatVehicle) + Math.cos(radlatUser) * Math.cos(radlatVehicle) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344;

      return dist;
    }
  }

}
