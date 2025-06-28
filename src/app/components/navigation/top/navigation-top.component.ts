import { Component, Inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventType, Router, RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from 'src/app/services/auth.service';
import { SESSION, Session } from 'src/app/services/tokens/session.token';
import { NzButtonModule } from '@nz/button';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { tap } from 'rxjs';

@Component({
  selector: 'app-navigation-top',
  templateUrl: './navigation-top.component.html',
  styleUrl: './navigation-top.component.css',
  imports: [FormsModule, NzSelectModule, RouterModule, NzButtonModule, NzIconModule, NzDrawerModule],
})
export class NavigationTopComponent implements OnInit {
  private drawerRef = signal<NzDrawerRef | undefined>(void 0);

  @ViewChild('drawerTmpl') drawerTmpl!: TemplateRef<any>;

  constructor(
    @Inject(SESSION) protected session: Session,
    private authSvc: AuthService,
    private drawerSvc: NzDrawerService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        tap((event) => {
          if (event.type === EventType.NavigationStart) {
            this.drawerRef()?.close();
          }
        }),
      )
      .subscribe();
  }

  protected onLogout() {
    this.authSvc.logout().subscribe();
  }

  protected get hasAdminAccess() {
    // TODO Implement this properly.
    return this.session.isActive && this.session.firebaseUser?.uid === 'smBGmW6JGWbr0I7yIYzCmkXpIDa2';
  }

  protected onMenuBtnClick() {
    this.drawerRef.set(
      this.drawerSvc.create({
        nzPlacement: 'top',
        nzContent: this.drawerTmpl,
      }),
    );
  }
}
