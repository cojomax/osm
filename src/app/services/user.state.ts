import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserState {
  private _user = new BehaviorSubject<User | null>(null);

  get user$() {
    return this._user.asObservable();
  }
  get user() {
    return this._user.value;
  }
  set user(user: User | null) {
    this._user.next(user);
  }
}
