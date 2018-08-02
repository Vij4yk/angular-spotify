import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

class Profile {
  _id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  _id: string;
  username: string;
  email: string;
  playlists: object[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe(
      (profile: Profile) => {
        console.log(profile);
        this._id = profile._id;
        this.username = profile.username;
        this.email = profile.email;
        this.playlists = [];
      },
      err => {
        console.log(err);
        localStorage.clear();
        this.flashMessage.show('You are not logged in!', {
          cssClass: 'alert-danger',
          timeout: 3000
        });
        this.router.navigate(['login']);
        return false;
      }
    );
  }
}
