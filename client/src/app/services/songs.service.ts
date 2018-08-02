import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  constructor(private http: HttpClient) {}

  saveSong(song: object, userId: string) {
    return this.http
      .post('http://localhost:8080/users/save', { song, userId })
      .pipe(map(res => res));
  }
}
