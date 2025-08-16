import { Component, Inject, input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, EventType, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { tap } from 'rxjs';
import { NavigationMainComponent } from '../../../components/navigation/main/navigation-main.component';
import { Session, SESSION } from '../../../services/tokens/session.token';

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

    this.route.data.subscribe((event) => this.header.set(event['header']));
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
