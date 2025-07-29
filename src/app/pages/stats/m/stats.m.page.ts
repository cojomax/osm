import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { SeasonSelectorComponent, SelectedSeason } from 'src/app/components/selectors/season-selector.component';
import { StatsTableComponent } from '../../../components/stats-table/stats-table.component';
import { StatsPageService } from '../stats-page.service';
import { StatsPageState } from '../stats-page.state';

@Component({
  selector: 'osm-stats',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonComponent,
    NzIconDirective,
    RouterModule,
    SeasonSelectorComponent,
    StatsTableComponent,
  ],
  templateUrl: './stats.m.page.html',
  styleUrl: './stats.m.page.css',
})
export class StatsMPageComponent {
  protected svc = inject(StatsPageService);
  protected page = inject(StatsPageState);

  // TODO Season object is supposed to contain an aggregation of the season stats.

  onSeasonSelected(value: SelectedSeason) {
    this.svc.setActiveSeason(value);
  }

  // TODO Difference stats for cup competitions.
  // TODO Some seasons have more than one cup competition.

  protected seasonStats = computed(() => [
    { stat: 'Position', value: this.page.selectedSeason()?.league?.position },
    { stat: 'Played', value: this.page.seasonStats()?.gamesPlayed },
    { stat: 'Won', value: this.page.seasonStats()?.gamesWon },
    { stat: 'Lost', value: this.page.seasonStats()?.gamesLost },
    { stat: 'Drawn', value: this.page.seasonStats()?.gamesDrawn },
    { stat: 'Points', value: this.page.seasonPoints() },
    { stat: 'Scored', value: this.page.seasonStats()?.goalsScored },
    { stat: 'Conceded', value: this.page.seasonStats()?.goalsConceded },
    { stat: 'Difference', value: this.page.seasonStats()?.goalDifference },
    { stat: 'Clean Sheets', value: this.page.seasonStats()?.cleanSheets },
  ]);
}
