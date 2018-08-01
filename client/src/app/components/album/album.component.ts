import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  album = null;

  constructor(
    private _spotifyService: SpotifyService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._route.params.subscribe(params => {
      this._spotifyService.getAlbum(params.id).subscribe(album => {
        console.log(album);
        this.album = album;
      });
    });
  }
}
