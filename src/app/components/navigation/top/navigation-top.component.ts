import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { User, UserRole } from 'src/app/domain/user/user.model';
import { UserService } from 'src/app/services/user.service';
import { UserState } from 'src/app/services/user.state';

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
    protected userState: UserState,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userState.user$.subscribe((user) => {
      this.user = user;
      this.selectedRole = user?.role ?? UserRole.undefined;
    });
  }

  protected onRoleChange() {
    this.userService.setUserRoleTmp(this.selectedRole);
  }

  protected get hasAdminAccess() {
    return this.userService.hasAdminAccess();
  }
}
