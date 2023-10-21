import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideosPage } from "./pages/videos/videos.page";


const routes: Routes = [
  {
    path: "",
    component: VideosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideosRoutingModule {}
