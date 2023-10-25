import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API } from "../../common/models/constants";
import { Author, ProcessedVideo, Video } from "../../common/models/interfaces";
import { mergeMap, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActionsService {
  constructor(private http: HttpClient) {}

  updateAuthorVideos(
    authorId: number,
    video: Video | ProcessedVideo,
    action: "add" | "remove"
  ): Observable<Author | null> {
    return this.getAuthorById(authorId).pipe(
      mergeMap((author) => {
        if (author) {
          if (action === "add") {
            author.videos.push(video as Video);
          } else if (action === "remove") {
            author.videos = author.videos.filter((v) => v.id !== video.id);
          }
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
}
