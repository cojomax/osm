import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { User, UserRole } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SESSION, Session } from 'src/app/services/tokens/session.token';
import { NzButtonModule } from '@nz/button';
import { NzDrawerComponent, NzDrawerContentDirective } from 'ng-zorro-antd/drawer';
import { NavigationMainComponent } from '../main/navigation-main.component';

@Component({
  selector: 'app-navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrl: './navigation-top.component.css',
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerComponent,
    NzDrawerContentDirective,
    NavigationMainComponent,
  ],
})
export class NavigationTopComponent {
  protected selectedRole = UserRole.undefined;

  protected user: User | null = null;

  protected userRole = UserRole;
  protected isDrawerOpen = signal(false);

  constructor(
    @Inject(SESSION) protected session: Session,
    private authSvc: AuthService,
  ) {}

  protected onLogout() {
    this.authSvc.logout().subscribe();
  }

  protected get hasAdminAccess() {
    // TODO Implement this properly.
    return this.session.isActive && this.session.firebaseUser?.uid === 'smBGmW6JGWbr0I7yIYzCmkXpIDa2';
  }

  protected onMenuBtnClick() {
    this.isDrawerOpen.update((value) => !value);
  }

  protected onDrawerClose() {
    this.isDrawerOpen.set(false);
  }
}
