import { FormControl } from "@angular/forms";
import { Author } from './../../common/models/interfaces';

export interface VideoForm {
  videoName: FormControl<string>;
  author: FormControl<Author>;
  categories: FormControl<number[]>;
}