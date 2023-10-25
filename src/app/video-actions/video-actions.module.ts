import { NgModule } from "@angular/core";
import { CommonModule as AngularCommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { CommonModule } from "../common/common.module";
import { VideoActionPage } from "./pages/video-action/video-action.page";
import { VideoActionsRoutingModule } from "./video-actions-routing.module";
import { VideoFormComponent } from "./components/video-form/video-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [VideoActionPage, VideoFormComponent],
  imports: [
    AngularCommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    VideoActionsRoutingModule,
    CommonModule,
  ],
})
export class VideoActionsModule {}
