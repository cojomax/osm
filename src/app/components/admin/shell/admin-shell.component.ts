import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'osm-admin-shell',
  imports: [NzMenuModule, RouterModule],
  styleUrl: './admin-shell.component.css',
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {}
