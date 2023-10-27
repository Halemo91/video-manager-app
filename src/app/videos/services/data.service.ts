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

  /**
   * Retrieves a list of categories from the backend API.
   * @returns An observable containing an array of Category objects.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  /**
   * Retrieves a list of authors from the backend API.
   * @returns An observable containing an array of Author objects.
   */
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${API}/authors`);
  }

  /**
   * Retrieves a list of videos from the backend API. These videos are processed and formatted
   * to include additional information such as categories and the highest quality format.
   * @returns An observable containing an array of ProcessedVideo objects.
   */
  getVideos(): Observable<ProcessedVideo[]> {
    return forkJoin([this.getAuthors(), this.getCategories()]).pipe(
      map(([authors, categories]) => {
        const processedVideos: ProcessedVideo[] = [];

        for (const author of authors) {
          for (const video of author.videos) {
            const videoCategories = categories
              .filter((category) => video.catIds.includes(category.id))
              .map((category) => category.name);
            const highestQualityFormat =
              typeof video.formats == "string"
                ? video.formats
                : this.findHighestQualityFormat(video.formats);
            const processedVideo: ProcessedVideo = {
              id: video.id,
              author: author.name,
              authorID: author.id,
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

  /**
   * Retrieves a specific video by its ID.
   * @param videoId - The ID of the video to retrieve.
   * @returns An observable containing the ProcessedVideo associated with the given ID or undefined if not found.
   */
  getVideoById(videoId: number): Observable<ProcessedVideo | undefined> {
    return this.getVideos().pipe(
      map((videos) => videos.find((video) => video.id == videoId))
    );
  }

  /**
   * Finds the highest quality video format among the available formats.
   * @param formats - An object representing video formats and their qualities.
   * @returns A string representing the highest quality format.
   */
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

  /**
   * Compares video resolutions to determine their order.
   * @param res1 - The resolution of the currentFormatInfo.
   * @param res2 - The resolution of the highestQualityInfo.
   * @returns A number indicating the comparison result.
   */
  private compareResolutions(res1: string, res2: string): number {
    return res1.localeCompare(res2);
  }
}
