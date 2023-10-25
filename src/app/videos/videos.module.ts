import { NgModule } from "@angular/core";
import { CommonModule as AngularCommonModule } from "@angular/common";
import { VideosTableComponent } from "./components/videos-table/videos-table.component";
import { VideosRoutingModule } from "./videos-routing.module";
import { CommonModule } from "../common/common.module";
import { VideosPage } from "./pages/videos/videos.page";

@NgModule({
  declarations: [VideosPage, VideosTableComponent],
  imports: [
    AngularCommonModule,
    VideosRoutingModule,
    CommonModule,
  ],
})
export class VideosModule {}
