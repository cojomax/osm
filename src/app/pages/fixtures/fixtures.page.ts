import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { Subscription, tap } from 'rxjs';
import { NzCardModule } from '@nz/card';
import { AsyncPipe, DatePipe, NgClass, NgOptimizedImage, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { IS_MOBILE } from '../../services/tokens/is-mobile.token';

const MONTHS = new Map<number, string>([
  [0, 'January'],
  [1, 'February'],
  [2, 'March'],
  [3, 'April'],
  [4, 'May'],
  [5, 'June'],
  [6, 'July'],
  [7, 'August'],
  [8, 'September'],
  [9, 'October'],
  [10, 'November'],
  [11, 'December'],
]);

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrl: './fixtures.page.css',
  imports: [
    DatePipe,
    NzCardModule,
    NzTagModule,
    NzDividerComponent,
    NgTemplateOutlet,
    NgClass,
    NgOptimizedImage,
    AsyncPipe,
    RouterLink,
    UpperCasePipe,
  ],
})
export class FixturesPageComponent implements OnInit {
  protected fixtures = signal<Map<string, Fixture[]>>(new Map());

  protected showFixtures = signal(false);
  protected showResults = signal(false);

  protected icon = computed(() => {
    const fileName = this.showFixtures() ? 'pitch-primary' : 'football-primary';
    return `/assets/icons/${fileName}.svg`;
  });

  protected isMobile = inject(IS_MOBILE);

  private subs = new Subscription();

  constructor(
    private fixtureSvc: FixtureService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.showFixtures.set(this.route.snapshot.routeConfig?.path === 'fixtures');
    this.showResults.set(this.route.snapshot.routeConfig?.path === 'results');

    this.subs.add(
      this.fixtureSvc
        .fetch()
        .pipe(
          tap((data) => {
            // TODO Filter by season first.
            // TODO Make into FireStore query.

            const list = data
              .filter((f) => f.date)
              .filter((f) => (this.showFixtures() ? f.date!.getTime() >= Date.now() : f.date!.getTime() <= Date.now()))
              .sort((a, b) =>
                this.showFixtures()
                  ? (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
                  : (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
              );

            list.forEach((f) => {
              const month = MONTHS.get(f.date!.getMonth())!;
              if (!this.fixtures().get(month)) {
                this.fixtures().set(month, []);
              }
              this.fixtures().get(month)!.push(f);
            });
          }),
        )
        .subscribe(),
    );
  }

  protected getScoreColor(home: number, opponent: number) {
    return home === opponent ? '' : home > opponent ? 'green' : 'red';
  }
}
