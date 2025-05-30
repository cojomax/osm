import { finalize, forkJoin, tap } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { PlayerService } from '../../services/player.service';
import { StatsService } from '../../services/stats.service';
import { SeasonStats } from '../../models/season-stats.model';
import { StatsMPageComponent } from './m/stats.m.page';
import { Data } from '@angular/router';
import { SeasonService } from '../../services/season.service';
import { SelectOption } from '../../models/option.model';
import { StatsPageComponent } from './d/stats.page';

@Injectable()
export class StatsPageService {
  playerData = signal<any>([]);
  seasonStats = signal<SeasonStats | null>(null);
  headerTxt = signal('');

  protected isMobile = signal(false);
  protected isLoading = signal(true);

  seasonPoints = computed(() => (this.seasonStats()?.gamesWon ?? 0) * 3 + (this.seasonStats()?.gamesDrawn ?? 0));

  // protected isMobile = inject(IS_MOBILE);

  private statsSvc = inject(StatsService);
  private seasonSvc = inject(SeasonService);
  private playerSvc = inject(PlayerService);
  private fixtureSvc = inject(FixtureService);

  initComponent(data: Data) {
    this.isMobile.set(data['mobile']);
    this.headerTxt.set(data['header']);
    return this.isMobile() ? StatsMPageComponent : StatsPageComponent;
  }

  seasons = signal<SelectOption[]>([]);

  initPage() {
    this.seasonSvc
      .fetch()
      .pipe(
        tap((seasons) => {
          const allOption: SelectOption = {
            value: 'all',
            label: 'All Seasons',
          };
          const sortedOptions = seasons
            .map(
              (s) =>
                ({
                  value: s.id,
                  label: s.name,
                }) as SelectOption,
            )
            .sort((a, b) => b.label.localeCompare(a.label));
          this.seasons.set([allOption, ...sortedOptions]);
        }),
      )
      .subscribe();

    return forkJoin([this.fixtureSvc.fetch(), this.playerSvc.fetch()]).pipe(
      tap((res) => {
        const seasonResults = res[0].filter((f) => f.competition?.id === 'tXLXUh6I1K9FyXaPpUmm');
        this.seasonStats.set(this.statsSvc.generateSeasonStats(seasonResults));

        const playerStats = this.statsSvc.generatePlayerStats(seasonResults);
        this.playerData.set(
          res[1]
            .filter((p) => !p.isLegend && p.squadNumber)
            .map((p) => ({
              id: p.id,
              name: p.fullName,
              position: p.position,
              squadNumber: p.squadNumber,
              goals: playerStats.goals.get(p.id) ?? 0,
              assists: playerStats.assists.get(p.id) ?? 0,
              contributions: playerStats.contributions.get(p.id) ?? 0,
            })),
        );
      }),
      finalize(() => {
        this.isLoading.set(false);
      }),
    );
  }
}
