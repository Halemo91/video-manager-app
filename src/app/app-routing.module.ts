import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: "", redirectTo: "/", pathMatch: "full" },
  {
    path: "",
    loadChildren: () =>
      import("./videos/videos.module").then((m) => m.VideosModule),
  },
  {
    path: "video-actions",
    loadChildren: () =>
      import("./video-actions/video-actions.module").then((m) => m.VideoActionsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
