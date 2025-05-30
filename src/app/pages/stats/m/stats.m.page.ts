import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SeasonStats } from 'src/app/models/season-stats.model';
import { StatsPageService } from '../stats-page.service';
import { FormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { DashIfEmptyPipe } from '../../../shared/pipes/dash-if-empty.pipe';
import { DecimalPipe } from '@angular/common';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'osm-stats',
  imports: [FormsModule, NzOptionComponent, NzSelectComponent, DashIfEmptyPipe, DecimalPipe, NzStatisticComponent],
  templateUrl: './stats.m.page.html',
  styleUrl: './stats.m.page.css',
})
export class StatsMPageComponent implements OnInit {
  topScorers = computed(() =>
    this.page
      .playerData()
      .sort((a: any, b: any) => (a.goals < b.goals ? 1 : -1))
      .filter((p: any, i: number) => !!p.goals && i <= 2),
  );

  topAssistants = computed(() =>
    this.page
      .playerData()
      .sort((a: any, b: any) => (a.assists < b.assists ? 1 : -1))
      .filter((p: any, i: number) => !!p.assists && i <= 2),
  );

  topContributions = computed(() =>
    this.page
      .playerData()
      .sort((a: any, b: any) => (a.contributions < b.contributions ? 1 : -1))
      .filter((p: any, i: number) => !!p.contributions && i <= 2),
  );

  protected isLoading = signal(true);
  protected seasonStats = signal<SeasonStats | null>(null);
  protected seasonPoints = computed(() => {
    const wins = this.seasonStats()?.gamesWon ?? 0;
    const draws = this.seasonStats()?.gamesDrawn ?? 0;
    return wins * 3 + draws;
  });

  protected page = inject(StatsPageService);

  // TODO Season object is supposed to contain an aggregation of the season stats.

  ngOnInit() {}
}
