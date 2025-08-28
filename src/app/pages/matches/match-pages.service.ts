import { inject, Injectable } from '@angular/core';
import { map, OperatorFunction, tap } from 'rxjs';
import { Fixture } from 'src/app/api/models/fixture.model';
import { SeasonSelection } from 'src/app/components/selectors/season-selector.component';
import { FixtureService } from 'src/app/services/fixture.service';
import { MONTHS } from 'src/app/shared/config';
import { MatchPagesState } from './match-pages.state';

// FIXME Refactor singleton
@Injectable({
  providedIn: 'root',
})
export class MatchesPageService {
  private readonly fixtureSvc = inject(FixtureService);
  private readonly state = inject(MatchPagesState);

  getScoreColor(fixture: Fixture) {
    return fixture.drawn ? '' : fixture.won ? 'green' : 'red';
  }

  fetchFixtures(season: SeasonSelection) {
    const operator = map((data: Fixture[]) =>
      data
        .filter((f) => f.date && f.date!.getTime() >= Date.now())
        .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)),
    );

    return this._fetchFixtures(season, operator).pipe(tap((data) => this.state.fixtures.set(data)));
  }

  fetchResults(season: SeasonSelection) {
    const operator = map((data: Fixture[]) =>
      data.filter((f) => f.played).sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)),
    );

    return this._fetchFixtures(season, operator).pipe(tap((data) => this.state.results.set(data)));
  }

  private _fetchFixtures(season: SeasonSelection, filter: OperatorFunction<Fixture[], Fixture[]>) {
    return this.fixtureSvc.fetchBySeason(season.seasonId, season.competitionId).pipe(
      filter,
      map((data) => {
        const map = new Map<string, Fixture[]>();
        data.forEach((f) => {
          const month = MONTHS.get(f.date!.getMonth())!;
          map.set(month, (map.get(month) ?? []).concat(f));
        });
        return map;
      }),
    );
  }
}
