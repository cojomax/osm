import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { NzSelectModule } from '@nz/select';
import { AdminNavComponent } from './components/admin/nav/admin-nav.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UserRole } from './domain/user/user.model';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AdminNavComponent,
    FormsModule,
    NavigationComponent,
    NzLayoutModule,
    NzSelectModule,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected userRole = UserRole;

  protected role = this.userRole.god;

  constructor(private firebaseSvc: FirebaseService) {
    this.firebaseSvc.initializeApp();
  }
}
