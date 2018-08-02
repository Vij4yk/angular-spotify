import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  constructor() {}

  validateRegister(user) {
    if (
      user.username == undefined ||
      user.email == undefined ||
      user.password == undefined ||
      user.password2 == undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  checkPasswords(pass1, pass2) {
    console.log(pass1, pass2);
    return pass1 === pass2 ? true : false;
  }
}
