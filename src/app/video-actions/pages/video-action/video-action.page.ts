import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ProcessedVideo } from "./../../../common/models/interfaces";
import { DataService } from "./../../../videos/services/data.service";

@Component({
  selector: "app-video-action",
  templateUrl: "./video-action.page.html",
  styleUrls: ["./video-action.page.css"],
})
export class VideoActionPage implements OnInit {
  video: ProcessedVideo | undefined;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (!queryParams?.videoId) {
        return;
      }

      const videoId = queryParams.videoId;
      this.getVideoById(videoId);
    });
  }

  private getVideoById(videoId: number) {
    this.dataService.getVideoById(videoId).subscribe((video) => {
      this.video = video;
    });
  }
}
