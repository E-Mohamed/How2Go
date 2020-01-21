export class Vehicle {
  id: number;
  type: string;
  lat: number;
  lng: number;
  distance: number;
  provider: {
    name: string;
    url: string;
  };
}
