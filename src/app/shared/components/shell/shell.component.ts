import { Component, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MobileShellComponent } from '../mobile-shell/mobile-shell.component';
import { DesktopShellComponent } from '../desktop-shell/desktop-shell.component';

@Component({
  selector: 'osm-shell',
  template: '<ng-container *ngComponentOutlet="component"></ng-container>',
  imports: [NgComponentOutlet],
})
export class ShellComponent {
  protected component = inject(ActivatedRoute).snapshot.data['mobile'] ? MobileShellComponent : DesktopShellComponent;
}
