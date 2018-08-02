import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SongsService } from '../../services/songs.service';

class Profile {
  _id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  album = null;
  error = false;

  constructor(
    private authService: AuthService,
    private songsService: SongsService,
    private _spotifyService: SpotifyService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    // loads all the songs for a specified album, based on the album id which is in the route
    this._route.params.subscribe(params => {
      this._spotifyService.getAlbum(params.id).subscribe(album => {
        console.log(album);
        this.album = album;
      });
    });

    this.authService.getProfile().subscribe(
      (profile: Profile) => {
        this.error = false;
      },
      err => {
        this.error = true;
      }
    );
  }

  getSongId(spotifyId, name, artist, preview, img) {
    const song = { spotifyId, name, artist, preview, img };
    const userId = localStorage.getItem('_id');
    console.log(song);
    this.songsService.saveSong(song, userId).subscribe(res => {
      console.log(res);
    });
  }
}
