import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzDividerComponent } from '@nz/divider';
import { NzEmptyComponent } from '@nz/empty';
import { SeasonSelection, SeasonSelectorComponent } from 'src/app/components/selectors/season-selector.component';
import { FixtureCardComponent } from '../components/fixture-card.component';
import { MatchesPageService } from '../match-pages.service';
import { MatchPagesState } from '../match-pages.state';

@Component({
  selector: 'osm-results',
  templateUrl: './results.page.html',
  styleUrl: '../match-pages.css',
  imports: [
    CommonModule,
    RouterLink,
    SeasonSelectorComponent,
    NzDividerComponent,
    NzEmptyComponent,
    FixtureCardComponent,
  ],
})
export class ResultsPageComponent {
  protected readonly state = inject(MatchPagesState);

  protected currentSeasonId = signal<string>('');

  private readonly matchSvc = inject(MatchesPageService);

  protected onSeasonSelected(season: SeasonSelection) {
    this.matchSvc.fetchResults(season).subscribe();
  }
}
