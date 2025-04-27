import { Component, input } from '@angular/core';
import { AdminShellComponent } from '../../../components/admin/shell/admin-shell.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavigationMainComponent } from '../../../components/navigation/main/navigation-main.component';
import { CommonModule } from '@angular/common';
import { NavigationTopComponent } from '../../../components/navigation/top/navigation-top.component';

@Component({
  selector: 'osm-desktop-shell',
  imports: [
    AdminShellComponent,
    CommonModule,
    NavigationMainComponent,
    NavigationTopComponent,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './desktop-shell.component.html',
  styleUrl: './desktop-shell.component.css',
})
export class DesktopShellComponent {
  viewState = input.required<string>();
}
