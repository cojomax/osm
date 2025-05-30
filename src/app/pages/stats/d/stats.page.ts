import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { finalize, forkJoin, tap } from 'rxjs';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { PlayerService } from '../../../services/player.service';
import { FixtureService } from '../../../services/fixture.service';
import { SeasonStats } from '../../../models/season-stats.model';
import { DecimalPipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy } from 'ag-grid-community';
import { IS_MOBILE } from '../../../services/tokens/is-mobile.token';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { DashIfEmptyPipe } from '../../../shared/pipes/dash-if-empty.pipe';

@Component({
  selector: 'osm-stats',
  imports: [NzStatisticComponent, AgGridAngular, DecimalPipe, NzSpinComponent, DashIfEmptyPipe],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.css',
})
export class StatsPageComponent implements OnInit {
  protected isLoading = signal(true);
  protected seasonStats = signal<SeasonStats | null>(null);
  protected playerData = signal<any>(null);
  protected seasonPoints = computed(
    () => (this.seasonStats()?.gamesWon ?? 0) * 3 + (this.seasonStats()?.gamesDrawn ?? 0),
  );

  protected isMobile = inject(IS_MOBILE);
  protected autoSizeStrategy: SizeColumnsToFitGridStrategy | SizeColumnsToContentStrategy = { type: 'fitGridWidth' };

  private statsSvc = inject(StatsService);
  private playerSvc = inject(PlayerService);
  private fixtureSvc = inject(FixtureService);

  // TODO Season object is supposed to contain an aggregation of the season stats.

  ngOnInit() {
    forkJoin([this.fixtureSvc.fetch(), this.playerSvc.fetch()])
      .pipe(
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
      )
      .subscribe();

    this.isMobile.subscribe((mobile) => {
      this.autoSizeStrategy = mobile ? { type: 'fitCellContents' } : { type: 'fitGridWidth' };
    });
  }

  protected colDefs: ColDef[] = [
    {
      field: 'squadNumber',
      cellDataType: 'number',
      headerName: '#',
      maxWidth: 70,
      sort: 'asc',
    },
    { field: 'name' },
    // { field: 'lastName' },
    { field: 'position' },
    // { field: 'appearances' },
    { field: 'goals' },
    { field: 'assists' },
    { field: 'contributions' },
    // { field: 'yellowCards' },
    // { field: 'redCards' },
  ];

  protected onGridReady(ev: GridReadyEvent) {
    // ev.api.sizeColumnsToFit();
    // ev.api.autoSizeAllColumns();
  }
}
