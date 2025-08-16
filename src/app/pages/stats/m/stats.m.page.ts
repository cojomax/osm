import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventType, NavigationStart, Router, RouterModule } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { filter, Subscription } from 'rxjs';
import { SeasonSelection, SeasonSelectorComponent } from 'src/app/components/selectors/season-selector.component';
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
export class StatsMPageComponent implements OnInit, OnDestroy {
  protected svc = inject(StatsPageService);
  protected page = inject(StatsPageState);
  private router = inject(Router);
  private routerSubscription?: Subscription;
  private navigationSubscription?: Subscription;

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event.type === EventType.NavigationStart))
      .subscribe((event: NavigationStart) => {
        // Check if the navigation is to one of our stats detail pages
        if (
          event.url.includes('/stats/goals') ||
          event.url.includes('/stats/assists') ||
          event.url.includes('/stats/contributions')
        ) {
          this.svc.saveScrollPosition(document.querySelector('#main-container')?.scrollTop ?? 0);
        }
      });

    queueMicrotask(() =>
      document.querySelector('#main-container')?.scrollTo({ top: this.page.mobileScrollPosition() }),
    );
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
  }
  // TODO Season object is supposed to contain an aggregation of the season stats.

  onSeasonSelected(value: SeasonSelection) {
    this.svc.setActiveSeason(value);
  }

  // TODO Difference stats for cup competitions.
  // TODO Some seasons have more than one cup competition.

  protected seasonStats = computed(() => {
    // FIXME Share better

    const leagueStats: { stat: string; value: number | string | undefined }[] = [
      { stat: 'Points', value: this.page.seasonPoints() },
      { stat: 'Played', value: this.page.seasonStats()?.gamesPlayed },
      { stat: 'Won', value: this.page.seasonStats()?.gamesWon },
      { stat: 'Lost', value: this.page.seasonStats()?.gamesLost },
      { stat: 'Drawn', value: this.page.seasonStats()?.gamesDrawn },
      { stat: 'Scored', value: this.page.seasonStats()?.goalsScored },
      { stat: 'Conceded', value: this.page.seasonStats()?.goalsConceded },
      { stat: 'Difference', value: this.page.seasonStats()?.goalDifference },
      { stat: 'Clean Sheets', value: this.page.seasonStats()?.cleanSheets },
    ];

    if (this.page.selectedSeason()?.league?.position) {
      leagueStats.unshift({ stat: 'Position', value: this.page.selectedSeason()?.league?.position });
    }

    const cupStats = [
      { stat: 'Played', value: this.page.seasonStats()?.gamesPlayed },
      { stat: 'Won', value: this.page.seasonStats()?.gamesWon },
      { stat: 'Lost', value: this.page.seasonStats()?.gamesLost },
      { stat: 'Scored', value: this.page.seasonStats()?.goalsScored },
      { stat: 'Conceded', value: this.page.seasonStats()?.goalsConceded },
      { stat: 'Difference', value: this.page.seasonStats()?.goalDifference },
      { stat: 'Clean Sheets', value: this.page.seasonStats()?.cleanSheets },
    ];

    return this.page.selectedCompetition()?.format === 'League' ? leagueStats : cupStats;
  });
}
