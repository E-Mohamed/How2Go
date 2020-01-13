import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { IonicModule } from '@ionic/angular';

import { MatExpansionModule } from '@angular/material/expansion';




@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatExpansionModule
  ],
  exports: [ListComponent]

})
export class ComponentsModule { }
