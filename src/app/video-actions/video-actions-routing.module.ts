import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoActionPage } from "./pages/video-action/video-action.page";


const routes: Routes = [
  {
    path: "",
    component: VideoActionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoActionsRoutingModule {}
