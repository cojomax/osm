import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  imports: [NzMenuModule, RouterModule],
  styleUrl: './admin-shell.component.css',
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  constructor(private _router: Router) {}

  protected onNavigate(route: string) {
    this._router.navigate([`/admin/${route}`]);
  }
}
