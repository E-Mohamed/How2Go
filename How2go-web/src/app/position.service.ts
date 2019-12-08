import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient) { }

  getPos(): Observable<any> {
    const url = 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=bornes-podotactiles';
    return this.http
      .get<any>(url)
      .pipe();
  }

  /*getLocation(): Observable<any> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          this.callApi(longitude, latitude);
          return this.http.get<any>(this.callApi(longitude,latitude))
        });
    } else {
       console.log("No support for geolocation");
       return;
       
    }
  }

  callApi(Longitude: number, Latitude: number){
    const url = 'https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}'
    //Call API
    return url;
  }*/

}
