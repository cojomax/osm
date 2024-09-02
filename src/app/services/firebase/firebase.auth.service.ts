import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { catchError, from, tap } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  constructor(private _firebaseSvc: FirebaseService) {}

  createWithCredentials(email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this._firebaseSvc.auth, email, password),
    ).pipe(
      tap((userCredential) => {
        const user = userCredential.user;
        console.log('User created:', user);
      }),
      catchError((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error creating user:', errorCode, errorMessage);
        throw error;
      }),
    );
  }
}
