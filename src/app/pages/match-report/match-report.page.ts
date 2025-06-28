import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, tap } from 'rxjs';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { AsyncPipe, DatePipe, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { IS_MOBILE } from '../../services/tokens/is-mobile.token';

@Component({
  selector: 'osm-match-report',
  imports: [DatePipe, NgTemplateOutlet, NgOptimizedImage, NzStatisticComponent, NgStyle, AsyncPipe],
  templateUrl: './match-report.page.html',
  styleUrl: './match-report.page.css',
})
export class MatchReportPage implements OnInit {
  @HostBinding('class.desktop') isDesktop = false;

  protected fixture = signal<Fixture | undefined>(void 0);

  protected isMobile = inject(IS_MOBILE);

  constructor(
    private fixtureSvc: FixtureService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        mergeMap((params) => this.fixtureSvc.find(params['id'])),
        tap((fixture) => {
          console.log(fixture);
          this.fixture.set(fixture);
        }),
      )
      .subscribe();

    this.isMobile.subscribe((isMobile) => (this.isDesktop = !isMobile));
  }
}
