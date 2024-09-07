import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from '@nz/menu';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  standalone: true,
  imports: [NzMenuModule, RouterModule],
})
export class NavigationComponent {}
