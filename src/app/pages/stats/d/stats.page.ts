import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy } from 'ag-grid-community';
import { NzStatisticComponent } from 'ng-zorro-antd/statistic';
import { SeasonSelectorComponent, SelectedSeason } from '../../../components/selectors/season-selector.component';
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
  protected autoSizeStrategy: SizeColumnsToFitGridStrategy | SizeColumnsToContentStrategy = { type: 'fitGridWidth' };
  protected page = inject(StatsPageState);

  private readonly svc = inject(StatsPageService);

  ngOnInit() {
    this.autoSizeStrategy = { type: 'fitGridWidth' };
  }

  protected colDefs: ColDef[] = [
    { field: 'firstName' },
    { field: 'lastName' },
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

  protected onSeasonSelected(value: SelectedSeason) {
    this.svc.setActiveSeason(value);
  }
}
