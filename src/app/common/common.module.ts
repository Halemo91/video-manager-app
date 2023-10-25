import { NgModule } from "@angular/core";
import { CommonModule as AngularCommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

import { ButtonComponent } from "./components/button/button.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";

@NgModule({
  declarations: [ButtonComponent, ConfirmationDialogComponent],
  imports: [
    AngularCommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [ButtonComponent],
})
export class CommonModule {}
