import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { User, UserRole } from 'src/app/domain/user/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SESSION, Session } from 'src/app/services/tokens/session.token';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrl: './navigation-top.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, RouterModule],
})
export class NavigationTopComponent {
  protected selectedRole = UserRole.undefined;

  protected user: User | null = null;

  protected userRole = UserRole;

  constructor(
    @Inject(SESSION) protected session: Session,
    private authSvc: AuthService,
    private userService: UserService,
  ) {}

  protected onRoleChange() {
    this.userService.setUserRoleTmp(this.selectedRole);
  }

  protected onLogout() {
    this.authSvc.logout().subscribe();
  }

  protected get hasAdminAccess() {
    return this.userService.hasAdminAccess();
  }
}
