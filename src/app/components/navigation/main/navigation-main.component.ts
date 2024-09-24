import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrl: './navigation-main.component.css',
  standalone: true,
  imports: [RouterModule],
})
export class NavigationMainComponent {}
