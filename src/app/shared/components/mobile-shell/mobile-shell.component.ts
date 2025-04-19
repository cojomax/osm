import { Component, Inject, input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { NavigationMainComponent } from '../../../components/navigation/main/navigation-main.component';
import { ActivatedRoute, EventType, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { tap } from 'rxjs';
import { Session, SESSION } from '../../../services/tokens/session.token';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'osm-mobile-shell',
  templateUrl: './mobile-shell.component.html',
  styleUrl: './mobile-shell.component.css',
  imports: [NavigationMainComponent, RouterLink, RouterOutlet, NzButtonComponent, NzIconDirective],
  providers: [NzDrawerService],
})
export class MobileShellComponent implements OnInit {
  viewState = input.required();

  protected header = signal('');

  @ViewChild('drawerTmpl') drawerTmpl!: TemplateRef<any>;

  private drawerRef = signal<NzDrawerRef | undefined>(void 0);

  constructor(
    protected route: ActivatedRoute,
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

    this.route.data
      .pipe(
        tap((d) => {
          console.log(d);
        }),
      )
      .subscribe((event) => this.header.set(event['header']));
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
