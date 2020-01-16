import { Vehicle } from './models/vehicle.model';

export default class CalculDistance {
    static distanceCalculator(lon1: number, lat1: number, vehicles: Vehicle[]) {
        for (const vehicle of vehicles) {
            if ((lat1 === vehicle.lat) && (lon1 === vehicle.lng)) {
                return 0;
            } else {
                const radlat1 = Math.PI * lat1 / 180;
                const radlat2 = Math.PI * vehicle.lat / 180;
                const theta = lon1 - vehicle.lng;
                const radtheta = Math.PI * theta / 180;
                let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515 * 1.609344 * 1000;

                vehicle.distance = dist;
            }
        }
        this.orderVehicles(vehicles);
    }

    static orderVehicles(vehicles: Vehicle[]) {
        vehicles.sort((a: Vehicle, b: Vehicle) => (a.distance > b.distance) ? 1 : -1);
    }
}