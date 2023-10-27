import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
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
    private actionsService: ActionsService,
    private snackBar: MatSnackBar,
    private router: Router
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

  onEditVideoClicked(video: ProcessedVideo) {
    this.router.navigate(['/video-actions'], { queryParams: { videoId: video.id } });
  }

  private deleteVideo(video: ProcessedVideo) {
    this.actionsService
      .updateAuthorVideos(video.authorID, video, "remove")
      .subscribe((response) => {
        if (!response) {
          this.snackBar.open("Video could not be deleted!", "Dismiss", {
            duration: 3000,
          });
          return;
        }
        this.snackBar.open("Video deleted!", "Dismiss", {
          duration: 3000,
        });
        this.updateList.emit();
      });
  }
}
