import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { AdminNavComponent } from './components/admin/nav/admin-nav.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminNavComponent, RouterModule, RouterOutlet, NavigationComponent, NzLayoutModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'osm';

  constructor(private firebaseSvc: FirebaseService) {
    this.firebaseSvc.initializeApp();
  }
}
