import { Author, Category, Video } from "./../../../common/models/interfaces";
import { DataService } from "./../../../videos/services/data.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VideoForm } from "../../models/video-form";

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
    private dataService: DataService
  ) {
    this.videoForm = this.createVideoFormForm();
  }

  ngOnInit() {
    this.dataService.getAuthors().subscribe((authors) => {
      this.authors = authors; 
    });

    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit() {
    if (this.videoForm.valid) {
      const formData = this.videoForm.value;

      const selectedAuthor = formData.author;
      if (!selectedAuthor) {
        return;
      }
      // const categories = formData.categories as number[]
      const newVideo: Video = {
        id: Math.floor(Math.random()) + 10,
        name: formData.videoName ? formData.videoName : "",
        catIds: [2],
        formats: { one: { res: "1080p", size: 1000 } },
        releaseDate: Date().toString(),
      };

      this.dataService
        .addVideoToAuthor(selectedAuthor.id, newVideo)
        .subscribe((savedVideo) => {
          console.log("Video saved:", savedVideo);
          this.router.navigate(["/"]);
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
}
