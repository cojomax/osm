import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NzDividerModule } from '@nz/divider';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { finalize, forkJoin, map, mergeMap, Subscription, tap } from 'rxjs';
import { Season } from 'src/app/api/models/season.model';
import { AppCache } from 'src/app/services/app-cache';
import { SeasonService } from 'src/app/services/season.service';
import { Goal } from '../../api/models/goal.model';
import { Player } from '../../api/models/player.model';
import { SwiperComponent } from '../../components/swiper/swiper.component';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { Position } from '../../models/position.enum';
import { StatisticType } from '../../models/statistic-type.enum';
import { Statistic } from '../../models/statistic.model';
import { FixtureService } from '../../services/fixture.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'osm-team',
  imports: [NzDividerModule, SwiperComponent, NzSpinComponent],
  templateUrl: './team.page.html',
  styleUrl: './team.page.css',
})
export class TeamPageComponent implements OnInit {
  protected isLoading = signal(true);

  protected goalkeepers = computed<PlayerStatistic[]>(() =>
    this.mapToPlayerStatistics(this.players(), Position.Goalkeeper),
  );

  protected defenders = computed<PlayerStatistic[]>(() =>
    this.mapToPlayerStatistics(this.players(), Position.Defender),
  );

  protected midfielders = computed<PlayerStatistic[]>(() =>
    this.mapToPlayerStatistics(this.players(), Position.Midfielder),
  );

  protected forwards = computed<PlayerStatistic[]>(() => this.mapToPlayerStatistics(this.players(), Position.Forward));

  protected legends: PlayerStatistic[] = [];

  private players = signal<Player[]>([]);
  private goals = signal<Goal[]>([]);

  protected season = signal<Season | undefined>(void 0);
  protected seasonName = computed(() => this.season()?.name ?? '');

  private subs = new Subscription();
  private readonly fixtureSvc = inject(FixtureService);
  private readonly playerSvc = inject(PlayerService);
  private readonly seasonSvc = inject(SeasonService);
  private readonly cache = inject(AppCache);

  ngOnInit() {
    this.subs.add(
      forkJoin([
        this.playerSvc.fetch().pipe(tap((players) => this.players.set(players))),
        this.seasonSvc.fetch().pipe(
          tap(() => this.season.set(this.cache.seasons()[0])),
          mergeMap(() =>
            this.fixtureSvc.fetchBySeason(this.season()?.id!).pipe(
              map((fixtures) => fixtures.filter((f) => f.date && f.date < new Date())),
              map((fixtures) => fixtures.flatMap((f) => f.goals)),
              tap((goals) => this.goals.set(goals)),
            ),
          ),
        ),
      ])
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(),
    );
  }
  // goals
  // assists
  // appearances
  // clean sheets

  private mapToPlayerStatistics(players: Player[], position: Position) {
    return players
      .filter((p) => !p?.isLegend && p.isActive && p.position === position)
      .sort((a, b) => (a.squadNumber < b.squadNumber ? -1 : 1))
      .map((p) => new PlayerStatistic(p, this.getPlayerStats(p)));
  }

  private getPlayerStats(player: Player): Statistic[] {
    const goals = this.goals().filter((g) => g?.scored?.id === player.id).length;
    const assists = this.goals().filter((g) => g?.assisted?.id === player.id)?.length;

    // const bestStatistics: { label: string; value: number }[] = [];
    // const statPriorityOrder = [StatisticType.Goals, StatisticType.Assists, StatisticType.CleanSheets, StatisticType.Appearances];
    //
    // for (let i = 0; i < statPriorityOrder.length; i++) {
    //   if (bestStatistics.length === 2) {
    //     return bestStatistics;
    //   }
    //
    //   const stat = this.stats()!.find((stat) => stat.type === statPriorityOrder[i]);
    //   if (stat?.value) {
    //     bestStatistics.push({ label: statPriorityOrder[i], value: stat.value });
    //   }
    // }

    return [
      { type: StatisticType.Goals, value: goals },
      { type: StatisticType.Assists, value: assists },
    ];
  }
}
