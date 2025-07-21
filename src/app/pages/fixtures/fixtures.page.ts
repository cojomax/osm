import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../api/models/fixture.model';
import { first, mergeMap, Subscription, tap } from 'rxjs';
import { NzCardModule } from '@nz/card';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
  UpperCasePipe,
} from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { IS_MOBILE } from '../../services/tokens/is-mobile.token';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { compareByIdFn } from '../../shared/utility/form.util';
import { Season } from '../../api/models/season.model';
import { FormsModule } from '@angular/forms';
import { State } from '../../services/state';
import { SeasonService } from '../../services/season.service';

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
  protected readonly state = inject(State);

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

  protected getScoreColor(home: number, opponent: number, homePens: number | null, oppPens: number | null) {
    let result: 'w' | 'l' | 'd';
    if (homePens || oppPens) {
      result = (homePens ?? 0) > (oppPens ?? 0) ? 'w' : 'l';
    } else {
      result = home === opponent ? 'd' : home > opponent ? 'w' : 'l';
    }

    return result === 'd' ? '' : result === 'w' ? 'green' : 'red';
  }

  protected readonly compareByIdFn = compareByIdFn;

  protected selectedSeason: Season | undefined;

  onSeasonSelected(season: Season) {
    this.selectedSeason = season;
    this.fetchFixtures().subscribe();
  }

  private fetchFixtures() {
    return this.fixtureSvc.query('season.id', this.selectedSeason?.id!).pipe(
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
