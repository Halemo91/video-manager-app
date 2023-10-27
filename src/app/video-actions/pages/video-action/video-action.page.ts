import { Subscription } from "rxjs";
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

  private subscription!: Subscription;

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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getVideoById(videoId: number) {
    this.subscription = this.dataService
      .getVideoById(videoId)
      .subscribe((video) => {
        this.video = video;
      });
  }
}
