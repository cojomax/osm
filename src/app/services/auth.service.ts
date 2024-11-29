import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase/auth';
import { catchError, take, tap } from 'rxjs';
import { FirebaseAuthService } from '../api/firebase/services/firebase.auth.service';
import { Session, SESSION } from './tokens/session.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private firebaseSvc: FirebaseAuthService,
    private router: Router,
    @Inject(SESSION) private session: Session,
  ) {
    this.subscribeToUserChanges();
  }

  loginWithPassword(email: string, password: string) {
    return this.firebaseSvc.signInEmailAndPassword(email, password).pipe(
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
    return this.firebaseSvc.logout().pipe(
      take(1),
      tap(() => {
        this.router.navigateByUrl('/');
      }),
    );
  }

  private subscribeToUserChanges() {
    this.firebaseSvc
      .onUserChange()
      .pipe(
        tap((user: FirebaseUser | null) => {
          this.session.firebaseUser = user;
        }),
      )
      .subscribe();
  }
}
