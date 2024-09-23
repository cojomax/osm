import { Injectable } from '@angular/core';
import { User, UserRole } from '../domain/user/user.model';
import { FirebaseAuthService } from './firebase/firebase.auth.service';
import { UserState } from './user.state';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private state: UserState,
    private _authSvc: FirebaseAuthService,
  ) {}

  // login(email: string, password: string) {
  //   return this._authSvc.authWithPassword(email, password).pipe(
  //     take(1),
  //     // tap((result) => {
  //     //   this.state.user = new User({
  //     //     id: result.uid,
  //     //     username: result.email ?? '',
  //     //     email: result.email ?? '',
  //     //     role: UserRole.undefined,
  //     //   });
  //     // }),
  //   );
  // }

  setUserRoleTmp(role: UserRole) {
    if (!this.state.user) {
      return;
    }

    const _user = { ...this.state.user, role } as User;
    this.state.user = _user;
  }

  hasAdminAccess() {
    this.state.user?.isAdmin || false;
  }
}
