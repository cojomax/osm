import { Injectable, signal } from '@angular/core';
import { Fixture } from 'src/app/api/models/fixture.model';
import { SeasonSelection } from 'src/app/components/selectors/season-selector.component';

// FIXME Refactor singleton
@Injectable({ providedIn: 'root' })
export class MatchPagesState {
  fixtures = signal<Map<string, Fixture[]>>(new Map());
  results = signal<Map<string, Fixture[]>>(new Map());
  season: SeasonSelection = { seasonId: '', competitionId: '' };
}
