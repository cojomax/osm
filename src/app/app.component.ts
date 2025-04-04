import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { RouteService } from './services/route.service';
import { register } from 'swiper/element/bundle';
import { MobileShellComponent } from './shared/components/mobile-shell/mobile-shell.component';
import { IS_MOBILE } from './services/tokens/is-mobile.token';
import { DesktopShellComponent } from './shared/components/desktop-shell/desktop-shell.component';

type ViewState = 'public' | 'admin' | 'login';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NzLayoutModule, RouterModule, MobileShellComponent, DesktopShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected isMobile = inject(IS_MOBILE);
  /** @deprecated This needs to read from the user. */
  protected viewState = signal<ViewState>('public');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeSvc: RouteService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isAdmin = event.urlAfterRedirects.substring(0, 6) === `/${this.routeSvc.routes.admin}`;
        const isLogin = event.urlAfterRedirects.substring(0, 6) === `/${this.routeSvc.routes.login}`;

        this.viewState.set(!isAdmin && !isLogin ? 'public' : isAdmin ? 'admin' : 'login');
      }
    });

    // Register Swiper web components
    register();
  }
}
