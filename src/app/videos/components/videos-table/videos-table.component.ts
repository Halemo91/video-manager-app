import { Component, Input, OnInit } from "@angular/core";
import { ProcessedVideo } from "../../../common/models/interfaces";

@Component({
  selector: "mi-videos-table",
  templateUrl: "./videos-table.component.html",
  styleUrls: ["./videos-table.component.css"],
})
export class VideosTableComponent implements OnInit {
  @Input() videos: ProcessedVideo[] = [];
  constructor() {
  }

  ngOnInit() {}

  
}
