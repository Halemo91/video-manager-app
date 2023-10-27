import { Router } from "@angular/router";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { VideoForm } from "../../models/video-form";
import { ActionsService } from "../../services/actions.service";
import {
  Author,
  Category,
  ProcessedVideo,
  Video,
} from "./../../../common/models/interfaces";
import { DataService } from "./../../../videos/services/data.service";

@Component({
  selector: "app-video-form",
  templateUrl: "./video-form.component.html",
  styleUrls: ["./video-form.component.css"],
})
export class VideoFormComponent implements OnInit {
  videoForm: FormGroup<VideoForm>;
  authors!: Author[];
  categories!: Category[];

  @Input() video: ProcessedVideo | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private actionsService: ActionsService,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.videoForm = this.createVideoFormForm();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    const video = changes["video"];
    if (video && video.currentValue) {
      this.updateVideoForm(video.currentValue);
    }
  }

  ngOnInit() {
    this.loadAuthors();
  }

  onSubmit() {
    const formData = this.videoForm.value;
    const selectedAuthorID = formData.authorID;
    const categories = formData.categories as number[];

    if (!selectedAuthorID || !formData.videoName || !categories) {
      return;
    }

    let videoToSend: Video;
    let typeOfSending: string;

    if (this.video) {
      videoToSend = {
        id: this.video.id,
        name: formData.videoName,
        catIds: categories,
        releaseDate: this.video.releaseDate,
        formats: this.video.highestQualityFormat,
      };
      typeOfSending = "edit";

      if (this.video.authorID !== selectedAuthorID) {
        this.updateVideoAuthors(
          this.video.authorID,
          selectedAuthorID,
          videoToSend
        );
        return;
      }
    } else {
      videoToSend = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        name: formData.videoName,
        catIds: categories,
        formats: { one: { res: "1080p", size: 1000 } },
        releaseDate: Date().toString(),
      };
      typeOfSending = "add";
    }
    this.updateAuthorVideos(selectedAuthorID, videoToSend, typeOfSending);
  }

  private createVideoFormForm(): FormGroup {
    return this.formBuilder.group({
      videoName: ["", Validators.required],
      authorID: [null, Validators.required],
      categories: [[], Validators.required],
    });
  }

  private updateVideoForm(videoData: ProcessedVideo) {
    const categoryNames: string[] = videoData.categories;

    const categoryIds: number[] = categoryNames.map((categoryName) => {
      const category = this.categories?.find((cat) => cat.name == categoryName);
      return category ? category.id : -1;
    });

    this.videoForm.patchValue({
      videoName: videoData.name,
      authorID: videoData.authorID,
      categories: categoryIds,
    });
  }

  private updateAuthorVideos(
    selectedAuthorID: number,
    videoToSend: Video,
    typeOfSending: string
  ) {
    let videoMessage = this.video ? "modified" : "added";
    this.actionsService
      .updateAuthorVideos(selectedAuthorID, videoToSend, typeOfSending)
      .subscribe((response) => {
        if (!response) {
          this.showSnackBar("Video could not be " + videoMessage);
          return;
        }

        this.router.navigate(["/"]);
        this.showSnackBar("Video " + videoMessage + " successfully");
      });
  }

  private updateVideoAuthors(
    oldAuthorId: number,
    newAuthorId: number,
    videoToSend: Video
  ) {
    this.actionsService
      .updateVideoAuthors(oldAuthorId, newAuthorId, videoToSend)
      .subscribe((response) => {
        if (!response) {
          this.showSnackBar("Error try again later!");
          return;
        }

        this.router.navigate(["/"]);
        this.showSnackBar("Video modified successfully");
      });
  }

  private loadAuthors() {
    this.dataService.getAuthors().subscribe((authors) => {
      this.authors = authors;
    });
  }

  private loadCategories() {
    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, "Dismiss", {
      duration: 3000,
    });
  }
}
