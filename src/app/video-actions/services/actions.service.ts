import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API } from "../../common/models/constants";
import { Author, ProcessedVideo, Video } from "../../common/models/interfaces";
import { catchError, Observable, of, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActionsService {
  constructor(private http: HttpClient) {}

  updateAuthorVideos(
    authorId: number,
    video: Video | ProcessedVideo,
    sendingAction: string
  ): Observable<Author | null> {
    return this.getAuthorById(authorId).pipe(
      switchMap((author) => {
        if (!author) {
          return of(null);
        }

        if (sendingAction === "add") {
          author.videos.push(video as Video);
        } else if (sendingAction === "remove") {
          author.videos = author.videos.filter((v) => v.id !== video.id);
        } else if (sendingAction === "edit") {
          const index = author.videos.findIndex((v) => v.id === video.id);
          if (index !== -1) {
            author.videos[index] = video as Video;
          }
        }
        return this.updateAuthor(author);
      })
    );
  }


  updateVideoAuthors(
    oldAuthorId: number,
    newAuthorId: number,
    video: Video | ProcessedVideo
  ): Observable<Author | null> {
    return this.getAuthorById(oldAuthorId).pipe(
      switchMap((oldAuthor) => {
        if (!oldAuthor) {
          return of(null);
        }
        oldAuthor.videos = oldAuthor.videos.filter((v) => v.id !== video.id);
        return this.updateAuthor(oldAuthor);
      }),
      switchMap(() => {
        return this.getAuthorById(newAuthorId).pipe(
          switchMap((newAuthor) => {
            if (!newAuthor) {
              return of(null);
            }
            newAuthor.videos.push(video as Video);
            return this.updateAuthor(newAuthor);
          })
        );
      }),
      catchError(() => of(null))
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
