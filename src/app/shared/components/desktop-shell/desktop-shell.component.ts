import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavigationMainComponent } from '../../../components/navigation/main/navigation-main.component';
import { CommonModule } from '@angular/common';
import { NavigationTopComponent } from '../../../components/navigation/top/navigation-top.component';

@Component({
  selector: 'osm-desktop-shell',
  imports: [CommonModule, NavigationMainComponent, NavigationTopComponent, RouterModule, RouterOutlet],
  templateUrl: './desktop-shell.component.html',
  styleUrl: './desktop-shell.component.css',
})
export class DesktopShellComponent {
  // viewState = input.required<string>();
}
