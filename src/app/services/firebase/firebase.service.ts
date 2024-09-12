import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore/lite';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private _app: FirebaseApp | undefined;
  private _auth: Auth | undefined;
  private _db: Firestore | undefined;

  get app() {
    return this._app!;
  }

  get auth() {
    return this._auth!;
  }

  get db() {
    return this._db!;
  }

  initializeApp() {
    // Initialize Firebase
    this._app = initializeApp(environment.firebaseConfig);
    // Initialize Firebase Authentication and get a reference to the service
    this._auth = getAuth(this._app);
    // Initialize Cloud Firestore and get a reference to the service
    this._db = getFirestore(this._app);
  }
}
