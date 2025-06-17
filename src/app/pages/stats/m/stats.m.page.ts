import { Component, effect, inject } from '@angular/core';
import { StatsPageService } from '../stats-page.service';
import { FormsModule } from '@angular/forms';
import { Stat, StatsPageState } from '../stats-page.state';
import { StatsTableComponent } from '../../../components/stats-table/stats-table.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'osm-stats',
  imports: [FormsModule, StatsTableComponent, NzButtonComponent, RouterModule, NzIconDirective],
  templateUrl: './stats.m.page.html',
  styleUrl: './stats.m.page.css',
})
export class StatsMPageComponent {
  protected selectedSeason = '';

  protected svc = inject(StatsPageService);
  protected page = inject(StatsPageState);

  // TODO Season object is supposed to contain an aggregation of the season stats.

  constructor() {
    effect(() => {
      this.selectedSeason = this.svc.seasons().at(1)?.value ?? '';
    });
  }

  protected seasonStats: Array<Stat> = [
    { stat: 'Position', value: '5th' },
    { stat: 'Played', value: this.svc.seasonStats()?.gamesPlayed },
    { stat: 'Won', value: this.svc.seasonStats()?.gamesWon },
    { stat: 'Lost', value: this.svc.seasonStats()?.gamesLost },
    { stat: 'Drawn', value: this.svc.seasonStats()?.gamesDrawn },
    { stat: 'Points', value: this.svc.seasonPoints() },
    { stat: 'Scored', value: this.svc.seasonStats()?.goalsScored },
    { stat: 'Conceded', value: this.svc.seasonStats()?.goalsConceded },
    { stat: 'Difference', value: this.svc.seasonStats()?.goalDifference },
    { stat: 'Clean Sheets', value: this.svc.seasonStats()?.cleanSheets },
  ];
}
