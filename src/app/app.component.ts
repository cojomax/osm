import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { AdminShellComponent } from './components/admin/shell/admin-shell.component';
import { NavigationMainComponent } from './components/navigation/main/navigation-main.component';
import { NavigationTopComponent } from './components/navigation/top/navigation-top.component';
import { RouteService } from './services/route.service';

type ViewState = 'public' | 'admin' | 'login';

@Component({
  selector: 'app-root',
  imports: [
    AdminShellComponent,
    CommonModule,
    FormsModule,
    NavigationMainComponent,
    NavigationTopComponent,
    NzLayoutModule,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected viewState: ViewState = 'public';

  get isPublicView() {
    return this.viewState === 'public';
  }

  get isAdminView() {
    return this.viewState === 'admin';
  }

  get isLoginView() {
    return this.viewState === 'login';
  }

  constructor(
    private router: Router,
    private routeSvc: RouteService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isAdmin =
          event.urlAfterRedirects.substring(0, 6) ===
          `/${this.routeSvc.routes.admin}`;
        const isLogin =
          event.urlAfterRedirects.substring(0, 6) ===
          `/${this.routeSvc.routes.login}`;

        this.viewState =
          !isAdmin && !isLogin ? 'public' : isAdmin ? 'admin' : 'login';
      }
    });
  }
}
