import { inject, Injectable, signal } from '@angular/core';
import { Data } from '@angular/router';
import { first, of, tap } from 'rxjs';
import { SelectedSeason } from 'src/app/components/selectors/season-selector.component';
import { AppCache } from 'src/app/services/app-cache';
import { Option } from '../../models/option.model';
import { FixtureService } from '../../services/fixture.service';
import { StatsService } from '../../services/stats.service';
import { StatsPageComponent } from './d/stats.page';
import { StatsMPageComponent } from './m/stats.m.page';
import { StatsPageState } from './stats-page.state';

@Injectable({
  providedIn: 'root',
})
export class StatsPageService {
  headerTxt = signal('');

  protected isMobile = signal(false);
  protected isLoading = signal(true);

  private cache = inject(AppCache);
  private state = inject(StatsPageState);
  private statsSvc = inject(StatsService);
  private fixtureSvc = inject(FixtureService);

  initComponent(data: Data) {
    this.isMobile.set(data['mobile']);
    this.headerTxt.set(data['header']);
    return this.isMobile() ? StatsMPageComponent : StatsPageComponent;
  }

  seasons = signal<Option[]>([]);

  initPage() {
    // this.seasonSvc
    //   .fetch()
    //   .pipe(
    //     tap((seasons) => {
    //       const allOption = new Option('All Seasons', 'all');
    //       const sortedOptions = seasons
    //         .map((s) => new Option(s.name, s.id))
    //         .sort((a, b) => b.label.localeCompare(a.label));
    //       this.seasons.set([allOption, ...sortedOptions]);
    //     }),
    //   )
    //   .subscribe();
    // return forkJoin([this.fixtureSvc.fetch(), this.playerSvc.fetch()]).pipe(
    //   tap((res) => {
    //     const seasonResults = res[0].filter((f) => f.competition?.id === 'tXLXUh6I1K9FyXaPpUmm');
    //     this.seasonStats.set(this.statsSvc.generateSeasonStats(seasonResults));
    //     const playerStats = this.statsSvc.generatePlayerStats(seasonResults);
    //     this.state.playerData.set(
    //       res[1]
    //         .filter((p) => !p.isLegend && p.squadNumber)
    //         .map((p) => ({
    //           id: p.id,
    //           name: p.fullName,
    //           position: p.position,
    //           squadNumber: p.squadNumber,
    //           goals: playerStats.goals.get(p.id) ?? 0,
    //           assists: playerStats.assists.get(p.id) ?? 0,
    //           contributions: playerStats.contributions.get(p.id) ?? 0,
    //         })),
    //     );
    //   }),
    //   finalize(() => {
    //     this.isLoading.set(false);
    //   }),
    // );
  }

  setActiveSeason(value: SelectedSeason) {
    this.state.selectedSeason.set(this.cache.seasons().find((s) => s.id === value.seasonId)!);
    this.state.selectedCompetition.set(this.cache.competitions().find((c) => c.id === value.competitionId)!);
    this.getSeasonStats();
  }

  private fetchFixtures() {
    if (!this.state.selectedSeason() || !this.state.selectedCompetition()) {
      return of([]);
    }

    return this.fixtureSvc.query([
      { field: 'season.id', query: this.state.selectedSeason()!.id },
      { field: 'competition.id', query: this.state.selectedCompetition()!.id },
    ]);
  }

  private getSeasonStats() {
    return this.fetchFixtures()
      .pipe(
        first(),
        tap((fixtures) => {
          this.state.seasonStats.set(this.statsSvc.generateSeasonStats(fixtures));
        }),
      )
      .subscribe();
  }
}
