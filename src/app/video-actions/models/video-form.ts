import { FormControl } from "@angular/forms";
import { Author } from './../../common/models/interfaces';

export interface VideoForm {
  videoName: FormControl<string>;
  authorID: FormControl<number>;
  categories: FormControl<number[]>;
}