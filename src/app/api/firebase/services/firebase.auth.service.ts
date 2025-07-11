import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { BehaviorSubject, from } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private _userChangeSubject = new BehaviorSubject<FirebaseUser | null>(null);

  private auth = inject(Auth);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      // See docs for a list of available properties: https://firebase.google.com/docs/reference/js/auth.user
      this._userChangeSubject.next(user);
    });
  }

  onUserChange() {
    return this._userChangeSubject.asObservable();
  }

  signInEmailAndPassword(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signInGoogle() {
    throw new Error('Not implemented');
  }

  createUserEmailPassword(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }
}
