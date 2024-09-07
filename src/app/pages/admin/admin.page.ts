import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { PlayerFormComponent } from '../../components/forms/player/player.form';

@Component({
  standalone: true,
  imports: [AppComponent, PlayerFormComponent],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class AdminPageComponent {}
