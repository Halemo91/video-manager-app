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

  /**
   * Updates the videos associated with an author.
   * @param authorId - The ID of the author whose videos are to be updated.
   * @param video - The video to be added, removed, or edited.
   * @param sendingAction - The action to perform ('add', 'remove', or 'edit').
   * @returns An observable containing the updated author or null if the operation fails.
   */

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

  /**
   * Transfers a video from one author to another.
   * @param oldAuthorId - The ID of the author from whom the video is transferred.
   * @param newAuthorId - The ID of the author to whom the video is transferred.
   * @param video - The video to be transferred.
   * @returns An observable containing the updated authors or null if the operation fails.
   */
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

  /**
   * Updates the author's information via an HTTP PUT request to the backend API.
   * @param author - The author whose information is to be updated.
   * @returns An observable containing the updated author.
   */
  private updateAuthor(author: Author): Observable<Author> {
    const apiUrl = `${API}/authors/${author.id}`;
    return this.http.put<Author>(apiUrl, author);
  }

  /**
   * Retrieves author information by ID from the backend API.
   * @param id - The ID of the author to retrieve.
   * @returns An observable containing the author information.
   */
  private getAuthorById(id: number): Observable<Author> {
    const apiUrl = `${API}/authors/${id}`;
    return this.http.get<Author>(apiUrl);
  }
}
