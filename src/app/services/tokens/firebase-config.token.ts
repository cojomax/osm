import { InjectionToken } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore/lite';
import { environment } from '../../../environments/environment.development';

export const firebaseFactory = () => {
    const app = initializeApp(environment.firebaseConfig);
    // Initialize Firebase Authentication and get a reference to the service
    const auth = getAuth(app);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    return new Firebase(app, auth, db);
};

export class Firebase {
  constructor(
    public app: FirebaseApp,
    public auth: Auth,
    public db: Firestore,
  ) {}
}

export const FIREBASE = new InjectionToken<Firebase>(
  'firebase-config',
);  
