import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API } from "../../common/models/constants";
import {
  Author,
  Category,
  ProcessedVideo,
  Video,
} from "../../common/models/interfaces";
import { forkJoin, map, mergeMap, Observable, of } from "rxjs";

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
            const highestQualityFormat = this.findHighestQualityFormat(
              video.formats
            );
            console.log(author, videoCategories);
            const processedVideo: ProcessedVideo = {
              id: video.id,
              author: author.name,
              name: video.name,
              categories: videoCategories,
              releaseDate: video.releaseDate,
              highestQualityFormat: highestQualityFormat,
            };

            processedVideos.push(processedVideo);
          }
        }

        return processedVideos;
      })
    );
  }

  addVideoToAuthor(
    authorId: number,
    newVideo: Video
  ): Observable<Author | null> {
    return this.getAuthorById(authorId).pipe(
      mergeMap((author) => {
        if (author) {
          author.videos.push(newVideo);
          return this.updateAuthor(author);
        } else {
          return of(null);
        }
      })
    );
  }

  private updateAuthor(author: Author): Observable<Author> {
    const apiUrl = `${API}/authors/${author.id}`;
    return this.http.put<Author>(apiUrl, author);
  }

  private getAuthorById(id: number): Observable<Author> {
    const apiUrl = `${API}/authors/${id}`;
    return this.http.get<Author>(apiUrl);
  }
  
  private findHighestQualityFormat(formats?: {
    [key: string]: { res: string; size: number };
  }): string {
    if (!formats) {
      return "";
    }
    const formatNames = Object.keys(formats);

    if (formatNames.length === 0) {
      return "No Formats Available";
    }

    let highestQualityFormat = formatNames[0];

    for (let i = 1; i < formatNames.length; i++) {
      const currentFormat = formatNames[i];
      const currentFormatInfo = formats[currentFormat];
      const highestQualityInfo = formats[highestQualityFormat];

      if (
        currentFormatInfo.size > highestQualityInfo.size ||
        (currentFormatInfo.size === highestQualityInfo.size &&
          this.compareResolutions(
            currentFormatInfo.res,
            highestQualityInfo.res
          ) > 0)
      ) {
        highestQualityFormat = currentFormat;
      }
    }

    return `${highestQualityFormat} ${formats[highestQualityFormat].res}`;
  }

  private compareResolutions(res1: string, res2: string): number {
    return res1.localeCompare(res2);
  }
}
