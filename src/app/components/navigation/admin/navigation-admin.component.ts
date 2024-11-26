import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMenuModule } from '@nz/menu';

@Component({
    selector: 'app-navigation-admin',
    imports: [NzMenuModule],
    templateUrl: './navigation-admin.component.html',
    styleUrls: ['./navigation-admin.component.css']
})
export class NavigationAdminComponent {
  /**
   *
   */
  constructor(private _router: Router) {}
  protected onNavigate(route: string) {
    this._router.navigate([`/admin/${route}`]);
  }
}
