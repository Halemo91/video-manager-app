import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "../../services/data.service";
import { ProcessedVideo } from "./../../../common/models/interfaces";

@Component({
  selector: "app-videos",
  templateUrl: "./videos.page.html",
  styleUrls: ["./videos.page.css"],
})
export class VideosPage implements OnInit, OnDestroy  {
  videos: ProcessedVideo[] = [];
  private dataSubscription!: Subscription;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.dataSubscription = this.dataService.getVideos().subscribe((videos) => {
      this.videos = videos;
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
