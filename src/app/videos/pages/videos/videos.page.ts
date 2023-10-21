import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ProcessedVideo } from './../../../common/models/interfaces';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.css']
})
export class VideosPage implements OnInit {
  videos: ProcessedVideo[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
this.loadVideos()

  }

  loadVideos() {
   this.dataService.getVideos().subscribe((videos)=>{
   this.videos = videos
   })
  }

}
