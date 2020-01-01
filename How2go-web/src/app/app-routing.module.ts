import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VehiclesComponent} from "./vehicles/vehicles.component";


const routes: Routes = [
  { path: 'vehicles', component: VehiclesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
