import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
  UpperCasePipe,
} from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzCardModule } from '@nz/card';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { first, mergeMap, Subscription, tap } from 'rxjs';
import { Fixture } from '../../api/models/fixture.model';
import { Season } from '../../api/models/season.model';
import { AppCache } from '../../services/app-cache';
import { FixtureService } from '../../services/fixture.service';
import { SeasonService } from '../../services/season.service';
import { IS_MOBILE } from '../../services/tokens/is-mobile.token';
import { compareByIdFn } from '../../shared/utility/form.util';

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
    AsyncPipe,
    CommonModule,
    DatePipe,
    FormsModule,
    NgClass,
    NgOptimizedImage,
    NgTemplateOutlet,
    NzCardModule,
    NzDividerComponent,
    NzOptionComponent,
    NzSelectComponent,
    NzTagModule,
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
  protected readonly state = inject(AppCache);

  private subs = new Subscription();
  private readonly fixtureSvc = inject(FixtureService);
  private readonly seasonSvc = inject(SeasonService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.showFixtures.set(this.route.snapshot.routeConfig?.path === 'fixtures');
    this.showResults.set(this.route.snapshot.routeConfig?.path === 'results');

    this.subs.add(
      this.seasonSvc
        .fetch()
        .pipe(
          tap((res) => {
            this.selectedSeason = res[0];
          }),
          mergeMap((res) => this.fetchFixtures()),
        )
        .subscribe(),
    );
  }

  protected getScoreColor(fixture: Fixture) {
    return fixture.drawn ? '' : fixture.won ? 'green' : 'red';
  }

  protected readonly compareByIdFn = compareByIdFn;

  protected selectedSeason: Season | undefined;

  onSeasonSelected(season: Season) {
    this.selectedSeason = season;
    this.fetchFixtures().subscribe();
  }

  private fetchFixtures() {
    return this.fixtureSvc.query([{ field: 'season.id', query: this.selectedSeason?.id! }]).pipe(
      first(),
      tap((data) => {
        // TODO Make into FireStore query.

        const list = data
          .filter((f) => f.date)
          .filter((f) => (this.showFixtures() ? f.date!.getTime() >= Date.now() : f.date!.getTime() <= Date.now()))
          .sort((a, b) =>
            this.showFixtures()
              ? (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
              : (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
          );

        this.fixtures().clear();

        list.forEach((f) => {
          const month = MONTHS.get(f.date!.getMonth())!;
          this.fixtures().set(month, (this.fixtures().get(month) ?? []).concat(f));
        });
      }),
    );
  }
}
