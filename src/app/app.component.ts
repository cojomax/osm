import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title="osm";

  constructor(
    private firebaseSvc: FirebaseService,

  ) {
    this.firebaseSvc.initializeApp();
  }
}
