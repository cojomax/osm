import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzCardModule } from '@nz/card';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { mergeMap, tap } from 'rxjs';
import { SeasonSelection } from 'src/app/components/selectors/season-selector.component';
import { SeasonService } from 'src/app/services/season.service';
import { AppCache } from '../../../services/app-cache';
import { compareByIdFn } from '../../../shared/utility/form.util';
import { FixtureCardComponent } from '../components/fixture-card.component';
import { MatchesPageService } from '../match-pages.service';
import { MatchPagesState } from '../match-pages.state';

@Component({
  selector: 'osm-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrl: '../match-pages.css',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzDividerComponent,
    NzEmptyModule,
    NzTagModule,
    RouterLink,
    FixtureCardComponent,
  ],
})
export class FixturesPageComponent implements OnInit {
  protected currentSeasonId = signal<string>('');

  protected readonly state = inject(MatchPagesState);
  protected readonly cache = inject(AppCache);

  private readonly seasonSvc = inject(SeasonService);
  private readonly matchSvc = inject(MatchesPageService);

  ngOnInit() {
    // TODO Just set the current season on app init
    this.seasonSvc
      .fetch()
      .pipe(
        tap(() => {
          this.currentSeasonId.set(this.cache.seasons()[0].id);
        }),
        mergeMap(() => this.matchSvc.fetchFixtures({ seasonId: this.currentSeasonId(), competitionId: 'all' })),
      )
      .subscribe();
  }

  protected readonly compareByIdFn = compareByIdFn;

  protected onSeasonSelected(season: SeasonSelection) {
    this.matchSvc.fetchFixtures(season).subscribe();
  }
}
