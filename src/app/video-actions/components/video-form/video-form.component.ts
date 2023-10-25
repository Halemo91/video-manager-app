import { DataService } from "./../../../videos/services/data.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { VideoForm } from "../../models/video-form";
import { ActionsService } from "../../services/actions.service";
import { Author, Category, Video } from "./../../../common/models/interfaces";

@Component({
  selector: "app-video-form",
  templateUrl: "./video-form.component.html",
  styleUrls: ["./video-form.component.css"],
})
export class VideoFormComponent implements OnInit {
  videoForm: FormGroup<VideoForm>;
  authors!: Author[];
  categories!: Category[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private actionsService: ActionsService,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    this.videoForm = this.createVideoFormForm();
  }

  ngOnInit() {
    this.loadAuthors();
    this.loadCategories();
  }

  onSubmit() {
    if (this.videoForm.valid) {
      const formData = this.videoForm.value;

      const selectedAuthor = formData.author;
      if (!selectedAuthor || !formData.videoName || !formData.categories) {
        return;
      }
      const categories = formData.categories as number[];
      const newVideo: Video = {
        id: Math.floor(Math.random()) + 10,
        name: formData.videoName,
        catIds: categories,
        formats: { one: { res: "1080p", size: 1000 } },
        releaseDate: Date().toString(),
      };

      this.actionsService
        .updateAuthorVideos(selectedAuthor.id, newVideo, "add")
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
      author: [null, Validators.required],
      categories: [[], Validators.required],
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
