import { Inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { BehaviorSubject, from } from 'rxjs';
import {
  FIREBASE,
  Firebase,
} from '../../../services/tokens/firebase-config.token';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private _userChangeSubject = new BehaviorSubject<FirebaseUser | null>(null);

  constructor(@Inject(FIREBASE) private _firebase: Firebase) {
    onAuthStateChanged(this._firebase.auth, (user) => {
      // See docs for a list of available properties: https://firebase.google.com/docs/reference/js/auth.user
      this._userChangeSubject.next(user);
    });
  }

  onUserChange() {
    return this._userChangeSubject.asObservable();
  }

  signInEmailAndPassword(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this._firebase.auth, email, password),
    );
  }

  signInGoogle() {
    throw new Error('Not implemented');
  }

  createUserEmailPassword(email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this._firebase.auth, email, password),
    );
  }

  logout() {
    return from(signOut(this._firebase.auth));
  }
}
