import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMenuModule } from '@nz/menu';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [NzMenuModule],
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css'],
})
export class AdminNavComponent {
  /**
   *
   */
  constructor(private _router: Router) {}
  protected onNavigate(route: string) {
    this._router.navigate([`/admin/${route}`]);
  }
}
