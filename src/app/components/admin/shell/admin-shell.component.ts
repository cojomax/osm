import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  imports: [NzMenuModule, RouterModule],
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    a {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
    }

    img {
      width: 100px;
      margin-top: -28px;
    }

    ul {
      background-color: var(--color-light);
      border: none;
      padding: 0 12px;
    }

    .osm-container {
      height: calc(100% - var(--banner-height-desktop));
    }
  `,
  template: `
    <a routerLink="/">
      <img src="assets/osm-transparent.png" alt="app-logo" />
    </a>

    <ul nz-menu nzMode="horizontal">
      <li nz-menu-item nzMatchRouter routerLink="/admin/players" (click)="onNavigate('players')">Players</li>
      <li nz-menu-item nzMatchRouter routerLink="/admin/fixtures" (click)="onNavigate('fixtures')">Fixtures</li>
    </ul>

    <div class="osm-container">
      <router-outlet />
    </div>
  `,
})
export class AdminShellComponent {
  constructor(private _router: Router) {}

  protected onNavigate(route: string) {
    this._router.navigate([`/admin/${route}`]);
  }
}
