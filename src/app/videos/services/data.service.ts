import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API } from "../../common/models/constants";
import { Author, Category, ProcessedVideo } from "../../common/models/interfaces";
import { forkJoin, map, Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`);
  }

  getVideos(): Observable<ProcessedVideo[]> {
    return forkJoin([this.getAuthors(), this.getCategories()]).pipe(
      map(([authors, categories]) => {
        const processedVideos: ProcessedVideo[] = [];

        for (const author of authors) {
          for (const video of author.videos) {
            const videoCategories = categories
              .filter((category) => video.catIds.includes(category.id))
              .map((category) => category.name);

            const processedVideo: ProcessedVideo = {
              id: video.id,
              author: author.name,
              name: video.name,
              categories: videoCategories,
            };

            processedVideos.push(processedVideo);
          }
        }

        return processedVideos;
      })
    );
  }
}
