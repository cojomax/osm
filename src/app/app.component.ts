import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { AdminShellComponent } from './components/admin/shell/admin-shell.component';
import { NavigationAdminComponent } from './components/navigation/admin/navigation-admin.component';
import { NavigationMainComponent } from './components/navigation/main/navigation-main.component';
import { NavigationTopComponent } from './components/navigation/top/navigation-top.component';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AdminShellComponent,
    CommonModule,
    FormsModule,
    NavigationAdminComponent,
    NavigationMainComponent,
    NavigationTopComponent,
    NzLayoutModule,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected isAdminRoute = false;
  constructor(
    private firebaseSvc: FirebaseService,
    private router: Router,
  ) {
    this.firebaseSvc.initializeApp();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute =
          event.urlAfterRedirects.substring(0, 6) === '/admin';
      }
    });
  }
}
