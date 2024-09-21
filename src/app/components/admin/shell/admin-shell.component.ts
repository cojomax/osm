import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationAdminComponent } from '../../navigation/admin/navigation-admin.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [NavigationAdminComponent, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.css',
})
export class AdminShellComponent {}
