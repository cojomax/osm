import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy } from 'ag-grid-community';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { SeasonSelectorComponent } from '../../../components/selectors/season-selector.component';
import { IS_MOBILE } from '../../../services/tokens/is-mobile.token';
import { DashIfEmptyPipe } from '../../../shared/pipes/dash-if-empty.pipe';
import { StatsPageService } from '../stats-page.service';
import { StatsPageState } from '../stats-page.state';

@Component({
  selector: 'osm-stats',
  imports: [AgGridAngular, CommonModule, DashIfEmptyPipe, DecimalPipe, NzStatisticComponent, SeasonSelectorComponent],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.css',
})
export class StatsPageComponent implements OnInit {
  protected isLoading = signal(true);

  protected playerData = signal<any>(null);
  // protected seasonPoints = computed(
  //   () => (this.seasonStats()?.gamesWon ?? 0) * 3 + (this.seasonStats()?.gamesDrawn ?? 0),
  // );

  protected isMobile = inject(IS_MOBILE);
  protected autoSizeStrategy: SizeColumnsToFitGridStrategy | SizeColumnsToContentStrategy = { type: 'fitGridWidth' };
  protected page = inject(StatsPageState);

  private readonly svc = inject(StatsPageService);

  // TODO Season object is supposed to contain an aggregation of the season stats.

  ngOnInit() {
    // forkJoin([this.fixtureSvc.fetch(), this.playerSvc.fetch()])
    //   .pipe(
    //     tap((res) => {
    //       const seasonResults = res[0].filter((f) => f.competition?.id === 'tXLXUh6I1K9FyXaPpUmm');
    //       this.seasonStats.set(this.statsSvc.generateSeasonStats(seasonResults));

    //       const playerStats = this.statsSvc.generatePlayerStats(seasonResults);
    //       this.playerData.set(
    //         res[1]
    //           .filter((p) => !p.isLegend && p.squadNumber)
    //           .map((p) => ({
    //             id: p.id,
    //             name: p.fullName,
    //             position: p.position,
    //             squadNumber: p.squadNumber,
    //             goals: playerStats.goals.get(p.id) ?? 0,
    //             assists: playerStats.assists.get(p.id) ?? 0,
    //             contributions: playerStats.contributions.get(p.id) ?? 0,
    //           })),
    //       );
    //     }),
    //     finalize(() => {
    //       this.isLoading.set(false);
    //     }),
    //   )
    //   .subscribe();

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

  protected onSeasonSelected(value: { seasonId: string; competitionId: string }) {
    this.svc.setActiveSeason(value);
  }
}
