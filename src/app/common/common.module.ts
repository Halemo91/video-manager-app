import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule as AngularCommonModule } from '@angular/common';

import { ButtonComponent } from './components/button/button.component';



@NgModule({
  declarations: [ButtonComponent],
  imports: [AngularCommonModule, HttpClientModule],
  exports: [ButtonComponent]
})
export class CommonModule {}
