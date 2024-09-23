import { Inject, Injectable } from '@angular/core';
import { User as FirebaseUser } from 'firebase/auth';
import { catchError, take, tap } from 'rxjs';
import { FirebaseAuthService } from './firebase/firebase.auth.service';
import { Session, SESSION } from './tokens/session.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _firebaseSvc: FirebaseAuthService,
    @Inject(SESSION) private _session: Session,
  ) {
    this.subscribeToUserChanges();
  }

  loginWithPassword(email: string, password: string) {
    return this._firebaseSvc.signInEmailAndPassword(email, password).pipe(
      catchError((error) => {
        const errorCode = error.code;
        console.error('Error signing in:', errorCode);
        const errorMessage = error.message;
        console.error('Error signing in:', errorMessage);
        return error;
      }),
    );
  }

  logout() {
    return this._firebaseSvc.logout().pipe(take(1));
  }

  private subscribeToUserChanges() {
    this._firebaseSvc
      .onUserChange()
      .pipe(
        tap((user: FirebaseUser | null) => {
          this._session.firebaseUser = user;
        }),
      )
      .subscribe();
  }
}
