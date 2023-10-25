export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: VideoFormats;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  authorID: number;
  categories: string[];
  releaseDate: string;
  highestQualityFormat: string;
}
export interface VideoFormats {
  [formatName: string]: VideoFormat;
}
export interface VideoFormat {
  res: string;
  size: number;
}
