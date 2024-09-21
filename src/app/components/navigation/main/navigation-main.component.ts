import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from '@nz/menu';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrl: './navigation-main.component.css',
  standalone: true,
  imports: [NzMenuModule, RouterModule],
})
export class NavigationMainComponent {}
