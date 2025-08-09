import { AsyncPipe, CommonModule, DatePipe, NgClass, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzCardModule } from '@nz/card';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { first, mergeMap, tap } from 'rxjs';
import { SeasonSelectorComponent, SelectedSeason } from 'src/app/components/selectors/season-selector.component';
import { SeasonService } from 'src/app/services/season.service';
import { Fixture } from '../../api/models/fixture.model';
import { AppCache } from '../../services/app-cache';
import { FixtureService } from '../../services/fixture.service';
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
    NzTagModule,
    SeasonSelectorComponent,
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

  private readonly fixtureSvc = inject(FixtureService);
  private readonly seasonSvc = inject(SeasonService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.showFixtures.set(this.route.snapshot.routeConfig?.path === 'fixtures');
    this.showResults.set(this.route.snapshot.routeConfig?.path === 'results');
    if (this.showFixtures()) {
      this.seasonSvc
        .fetch()
        .pipe(
          first(),
          mergeMap(() => this.fetchFixtures({ seasonId: this.state.seasons()[0].id })),
        )
        .subscribe();
    }
  }

  protected getScoreColor(fixture: Fixture) {
    return fixture.drawn ? '' : fixture.won ? 'green' : 'red';
  }

  protected readonly compareByIdFn = compareByIdFn;

  onSeasonSelected(season: SelectedSeason) {
    this.fetchFixtures(season).subscribe();
  }

  private fetchFixtures(season: SelectedSeason) {
    return this.fixtureSvc.fetchBySeason(season.seasonId, season.competitionId).pipe(
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
