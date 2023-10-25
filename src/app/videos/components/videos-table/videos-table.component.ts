import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ProcessedVideo } from "../../../common/models/interfaces";
import { ConfirmationDialogComponent } from "./../../../common/components/confirmation-dialog/confirmation-dialog.component";
import { ActionsService } from "./../../../video-actions/services/actions.service";

@Component({
  selector: "mi-videos-table",
  templateUrl: "./videos-table.component.html",
  styleUrls: ["./videos-table.component.css"],
})
export class VideosTableComponent implements OnInit {
  @Input() videos: ProcessedVideo[] = [];

  @Output() updateList = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private actionsService: ActionsService
  ) {}

  ngOnInit() {}

  onDeleteVideoClicked(video: ProcessedVideo) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteVideo(video);
      }
    });
  }

  private deleteVideo(video: ProcessedVideo) {
    this.actionsService
      .updateAuthorVideos(video.authorID, video, "remove")
      .subscribe(() => {
        this.updateList.emit();
      });
  }
}
