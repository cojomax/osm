import { Component, inject, signal } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { ColDef } from 'ag-grid-community';
import { first, forkJoin, tap } from 'rxjs';
import { Competition } from 'src/app/api/models/competition.model';
import { Season } from 'src/app/api/models/season.model';
import { FormModalComponent } from 'src/app/components/admin/form-modal/form-modal.component';
import { FormModalService } from 'src/app/components/admin/form-modal/form-modal.service';
import { REPOSITORY_SERVICE } from 'src/app/components/admin/form-modal/form-modal.token';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { CompetitionService } from 'src/app/services/competition.service';
import { SeasonService } from 'src/app/services/season.service';
import { EditButtonComponent } from '../manage-players/renderers/edit-btn.component';
import { SeasonFormComponent } from './form/season.form';

@Component({
  selector: 'osm-manage-seasons',
  templateUrl: './manage-seasons.component.html',
  styleUrl: './manage-seasons.component.css',
  imports: [GridComponent, FormModalComponent, NzButtonModule, NzIconModule, SeasonFormComponent],
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: SeasonService }],
})
export class ManageSeasonsComponent {
  protected seasons = signal<Season[]>([]);
  protected competitions = signal<Competition[]>([]);

  protected colDefs: ColDef<Season>[] = [
    { field: 'name' },
    { field: 'startDate', cellDataType: 'date' },
    { field: 'endDate', cellDataType: 'date' },
    {
      headerName: 'League',
      valueGetter: (params) => {
        const league = params.data?.competitions.find((c) => c.isLeague);
        return `${league?.name} ${league?.tier}`;
      },
    },
    {
      headerName: 'Cups',
      valueGetter: (params) => {
        const cups = params.data?.competitions.filter((c) => c.isCup);
        return cups?.map((c) => `${c.name} ${c.tier}`).join(', ');
      },
    },
    {
      colId: 'edit',
      sortable: false,
      width: 100,
      cellRenderer: EditButtonComponent,
      cellRendererParams: {
        onEdit: this.onEditClick.bind(this),
      },
    },
  ];

  protected modalSvc = inject(FormModalService<Season>);
  protected selectedSeason = signal<Season | null>(null);

  private seasonSvc = inject(SeasonService);
  private competitionSvc = inject(CompetitionService);

  ngOnInit() {
    this.updateTableData().pipe(first()).subscribe();
  }

  protected onAdd() {
    this.openModal();
  }

  protected onEditClick(seasonId: string) {
    this.openModal(this.seasons().find((s) => s.id === seasonId) ?? null);
  }

  protected onModified() {
    this.updateTableData().pipe(first()).subscribe();
  }

  private openModal(season: Season | null = null) {
    this.selectedSeason.set(season);
    this.modalSvc.openModal(this.selectedSeason());
  }

  private updateTableData() {
    // TODO Force API call?
    return forkJoin([this.seasonSvc.fetch(), this.competitionSvc.fetch()]).pipe(
      tap(([seasons, competitions]) => {
        this.seasons.set(seasons);
        this.competitions.set(competitions);
      }),
    );
  }
}
