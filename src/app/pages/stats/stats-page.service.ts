import { inject, Injectable, signal } from '@angular/core';
import { Data } from '@angular/router';
import { first, forkJoin, of, tap } from 'rxjs';
import { SelectedSeason } from 'src/app/components/selectors/season-selector.component';
import { AppCache } from 'src/app/services/app-cache';
import { PlayerService } from 'src/app/services/player.service';
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
  private playerSvc = inject(PlayerService);

  initComponent(data: Data) {
    this.isMobile.set(data['mobile']);
    this.headerTxt.set(data['header']);
    return this.isMobile() ? StatsMPageComponent : StatsPageComponent;
  }

  seasons = signal<Option[]>([]);

  setActiveSeason(value: SelectedSeason) {
    this.state.selectedSeason.set(this.cache.seasons().find((s) => s.id === value.seasonId)!);
    this.state.selectedCompetition.set(this.cache.competitions().find((c) => c.id === value.competitionId)!);
    this.setStats();
  }

  private setStats() {
    return forkJoin([this.fetchFixtures(), this.playerSvc.fetch()])
      .pipe(
        first(),
        tap((res) => {
          this.state.seasonStats.set(this.statsSvc.generateSeasonStats(res[0]));
          const playerStats = this.statsSvc.generatePlayerStats(res[0]);

          this.state.playerData.set(
            res[1]
              .map((p) => ({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                position: p.position,
                goals: playerStats.goals.get(p.id) ?? 0,
                assists: playerStats.assists.get(p.id) ?? 0,
                contributions: playerStats.contributions.get(p.id) ?? 0,
              }))
              .filter((p) => p.contributions > 0),
          );
        }),
      )
      .subscribe();
  }

  private fetchFixtures() {
    return !this.state.selectedSeason() || !this.state.selectedCompetition()
      ? of([])
      : this.fixtureSvc.fetchBySeason(this.state.selectedSeason()!.id, this.state.selectedCompetition()!.id);
  }
}
