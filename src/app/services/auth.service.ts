import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User as FirebaseUser } from 'firebase/auth';
import { catchError, take, tap } from 'rxjs';
import { FirebaseAuthService } from '../api/firebase/services/firebase.auth.service';
import { SESSION } from './tokens/session.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebaseSvc = inject(FirebaseAuthService);
  private router = inject(Router);
  private session = inject(SESSION);

  constructor() {
    // this.subscribeToUserChanges();
  }

  loginWithPassword(email: string, password: string) {
    return this.firebaseSvc.signInEmailAndPassword(email, password).pipe(
      catchError((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:', errorCode, errorMessage);
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
