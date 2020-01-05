import { Component } from '@angular/core';
import * as map from 'leaflet';
import { PositionService } from './position.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'How2go-web';

  myIcon = map.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
  });

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    const myMap = map.map('map').setView([48.936616, 2.324789], 13);

    // Pour les devs on peut faire des fonction privé et mettre
    // le code dedans puis appelé ces fonctions depuis le ngOnInit
    map
      .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
      })
      .addTo(myMap);

    this.positionService.getPos().subscribe((data: any) => {
      data.records.forEach(point => {
        map.marker(
          [
            point.geometry.coordinates[1],
            point.geometry.coordinates[0]
          ],
          { icon: this.myIcon }
        ).bindPopup('bla bla de la trottinette')
          .addTo(myMap);
      });
    });
  }

}
