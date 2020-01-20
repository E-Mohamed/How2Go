import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    VehiclesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
