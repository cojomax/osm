import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'osm-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'osm';

  constructor(private firebaseSvc: FirebaseService) {
    this.firebaseSvc.initializeApp();
  }
}
