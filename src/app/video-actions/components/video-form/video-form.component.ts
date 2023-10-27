import { DataService } from "./../../../videos/services/data.service";
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
    if (this.videoForm.valid) {
      const formData = this.videoForm.value;

      const selectedAuthorID = formData.authorID;
      if (!selectedAuthorID || !formData.videoName || !formData.categories) {
        return;
      }
      const categories = formData.categories as number[];
      const newVideo: Video = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        name: formData.videoName,
        catIds: categories,
        formats: { one: { res: "1080p", size: 1000 } },
        releaseDate: Date().toString(),
      };

      this.actionsService
        .updateAuthorVideos(selectedAuthorID, newVideo, "add")
        .subscribe((response) => {
          if (!response) {
            this.snackBar.open("Video could not be added!", "Dismiss", {
              duration: 3000,
            });
            return;
          }

          this.router.navigate(["/"]);
          this.snackBar.open("Video added successfully", "Dismiss", {
            duration: 3000,
          });
        });
    }
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
}
