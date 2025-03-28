import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { NzDividerModule } from '@nz/divider';
import { finalize, forkJoin, map, Subscription, tap } from 'rxjs';
import { Player } from '../../api/models/player.model';
import { Position } from '../../models/position.enum';
import { PlayerService } from '../../services/player.service';
import { SwiperComponent } from '../../components/swiper/swiper.component';
import { FixtureService } from '../../services/fixture.service';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { Goal } from '../../api/models/goal.model';
import { Statistic } from '../../models/statistic.model';
import { StatisticType } from '../../models/statistic-type.enum';
import { NzSpinComponent } from 'ng-zorro-antd/spin';

@Component({
  imports: [CommonModule, NzDividerModule, SwiperComponent, NzSpinComponent],
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

  private subs = new Subscription();

  constructor(
    private fixtureSvc: FixtureService,
    private playerSvc: PlayerService,
  ) {}

  ngOnInit() {
    this.subs.add(
      forkJoin([
        this.playerSvc.fetch().pipe(tap((players) => this.players.set(players))),
        this.fixtureSvc.fetch().pipe(
          map((fixtures) => fixtures.filter((f) => f.date && f.date < new Date())),
          map((fixtures) => fixtures.flatMap((f) => f.goals)),
          tap((goals) => this.goals.set(goals)),
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
      .map((p) => new PlayerStatistic(p, this.getPlayerStats(p)))
      .filter((p) => !p.player?.isLegend && p.player.position === position)
      .sort((a, b) => (a.player.squadNumber < b.player.squadNumber ? -1 : 1));
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
