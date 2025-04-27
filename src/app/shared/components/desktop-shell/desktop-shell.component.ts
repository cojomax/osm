import { Component, input } from '@angular/core';
import { NavigationTopComponent } from '../../../components/navigation/top/navigation-top.component';
import { AdminShellComponent } from '../../../components/admin/shell/admin-shell.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavigationMainComponent } from '../../../components/navigation/main/navigation-main.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'osm-desktop-shell',
  imports: [
    CommonModule,
    NavigationTopComponent,
    AdminShellComponent,
    RouterOutlet,
    NavigationMainComponent,
    RouterModule,
  ],
  templateUrl: './desktop-shell.component.html',
  styleUrl: './desktop-shell.component.css',
})
export class DesktopShellComponent {
  viewState = input.required<string>();
}
