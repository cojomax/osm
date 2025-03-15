import { Component } from '@angular/core';
import { NavigationAdminComponent } from '../../navigation/admin/navigation-admin.component';

@Component({
  selector: 'app-admin-shell',
  imports: [NavigationAdminComponent],
  styles: `
    .nav-container {
      padding: 0 var(--space-md);
    }

    .content-container {
      height: 100%;
      padding: 0 var(--space-lg);
    }
  `,
  template: `
    <div class="nav-container">
      <app-navigation-admin></app-navigation-admin>
    </div>
    <div class="content-container">
      <ng-content></ng-content>
    </div>
  `,
})
export class AdminShellComponent {}
