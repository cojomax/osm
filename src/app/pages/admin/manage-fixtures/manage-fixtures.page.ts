import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { ColDef } from 'ag-grid-community';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { first, Subscription, tap } from 'rxjs';
import { Competition } from '../../../api/models/competition.model';
import { Fixture } from '../../../api/models/fixture.model';
import { Name } from '../../../api/models/name.model';
import { Player } from '../../../api/models/player.model';
import { Season } from '../../../api/models/season.model';
import { FormModalComponent } from '../../../components/admin/form-modal/form-modal.component';
import { FormModalService } from '../../../components/admin/form-modal/form-modal.service';
import { REPOSITORY_SERVICE } from '../../../components/admin/form-modal/form-modal.token';
import { GridComponent } from '../../../components/grid/grid.component';
import { SeasonSelection, SeasonSelectorComponent } from '../../../components/selectors/season-selector.component';
import { AppCache } from '../../../services/app-cache';
import { CompetitionService } from '../../../services/competition.service';
import { FixtureService } from '../../../services/fixture.service';
import { PlayerService } from '../../../services/player.service';
import { TeamService } from '../../../services/team.service';
import { VenueService } from '../../../services/venue.service';
import { EditButtonComponent } from '../manage-players/renderers/edit-btn.component';
import { FixtureFormComponent } from './form/fixture.form';

@Component({
  selector: 'osm-manage-fixtures',
  imports: [
    CommonModule,
    FixtureFormComponent,
    FormModalComponent,
    GridComponent,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SeasonSelectorComponent,
  ],
  templateUrl: './manage-fixtures.page.html',
  styleUrl: './manage-fixtures.page.css',
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: FixtureService }],
})
export class ManageFixturesPageComponent implements OnInit, OnDestroy {
  protected readonly fixtures = signal<Fixture[]>([]);
  protected readonly venues = signal<Name[]>([]);
  protected readonly teams = signal<Name[]>([]);
  // FIXME Enhance this to be appropriate for the selected season.
  protected readonly competitions = signal<Competition[]>([]);
  protected readonly players = signal<Player[]>([]);
  protected readonly seasons = signal<Season[]>([]);
  protected readonly selectedFixture = signal<Fixture | null>(null);
  protected readonly season = signal<Season | null>(null);

  private readonly datePipe: DatePipe;
  private readonly subs = new Subscription();

  @ViewChild(FixtureFormComponent) form!: FixtureFormComponent;

  protected readonly modalSvc = inject(FormModalService<Fixture>);
  protected readonly state = inject(AppCache);

  private readonly competitionSvc = inject(CompetitionService);
  private readonly fixtureSvc = inject(FixtureService);
  private readonly playerSvc = inject(PlayerService);
  private readonly teamSvc = inject(TeamService);
  private readonly venuesSvc = inject(VenueService);

  constructor() {
    this.datePipe = new DatePipe(inject(LOCALE_ID));
  }

  ngOnInit() {
    this.subs.add(
      this.venuesSvc
        .fetch()
        .pipe(tap((res) => this.venues.set(res)))
        .subscribe(),
    );

    this.subs.add(
      this.teamSvc
        .fetch()
        .pipe(tap((res) => this.teams.set(res.sort((a, b) => a.name.localeCompare(b.name)))))
        .subscribe(),
    );

    this.subs.add(
      this.competitionSvc
        .fetch()
        .pipe(tap((res) => this.competitions.set(res)))
        .subscribe(),
    );

    this.subs.add(
      this.playerSvc
        .fetch()
        .pipe(tap((res) => this.players.set(res)))
        .subscribe(),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected onSeasonSelected(value: SeasonSelection) {
    this.season.set(this.state.seasons().find((s) => s.id === value.seasonId) ?? null);
    this.updateTableData(value.seasonId).pipe(first()).subscribe();
  }

  protected colDefs: ColDef<Fixture>[] = [
    {
      field: 'date',
      cellDataType: 'date',
      sort: 'desc',
      valueFormatter: (params) => this.datePipe.transform(params.value, 'fullDate') ?? '',
    },
    {
      field: 'time',
      cellDataType: 'date',
      valueFormatter: (params) => this.datePipe.transform(params.value, 'shortTime') ?? '',
    },
    { field: 'venue.name' },
    {
      field: 'competition.tier',
      headerName: 'Competition',
      // cellRenderer: (params: ICellRendererParams<Competition>) => `${params.value?.name} ${params.value?.tier}`,
    },
    { field: 'opponent.name' },
    {
      colId: 'score',
      headerName: 'Score',
      sortable: false,
      valueFormatter: (params) => {
        if (params.data?.date! > new Date()) {
          return '';
        }
        const score = `${params.data?.homeGoals ?? 0} - ${params.data?.opponentGoals ?? 0}`;

        if (params.data?.forfeit) {
          return `${score} (Forfeit)`;
        }

        if (params.data?.penalties) {
          return `${params.data?.homeGoals ?? 0} (${params.data?.penaltiesHome}) - ${params.data?.opponentGoals ?? 0} (${params.data?.penaltiesOpponent})`;
        }

        return score;
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
    // {
    //   field: 'squadNumber',
    //   cellDataType: 'number',
    //   headerName: '#',
    //   width: 50,
    // },
    // { field: 'firstName' },
    // { field: 'lastName' },
    // { field: 'position' },
    // { field: 'country' },
    // {
    //   field: 'dob',
    //   cellDataType: 'date',
    //   headerName: 'Date of Birth',
    //   width: 150,
    //   valueFormatter: (params) => this.datePipe.transform(params.value) ?? '',
    // },
    // {
    //   field: 'height',
    //   cellDataType: 'number',
    //   headerName: 'Height (cm)',
    //   width: 150,
    // },
    // {
    //   field: 'action',
    //   maxWidth: 150,
    //   cellRenderer: EditButtonComponent,
    //   cellRendererParams: { onEdit: this.onEditClick.bind(this) },
    // },
  ];

  protected onAdd() {
    this.openModal();
  }

  protected onEditClick(id: string) {
    this.openModal(this.fixtures().find((f) => f.id === id)!);
  }

  private openModal(fixture: Fixture | null = null) {
    this.selectedFixture.set(fixture);
    this.modalSvc.openModal(this.selectedFixture());
  }

  private updateTableData(seasonId: string) {
    return this.fixtureSvc.query([{ field: 'season.id', query: seasonId }]).pipe(
      first(),
      tap((fixtures) => {
        this.fixtures.set(fixtures);
      }),
    );
  }

  protected onModified() {
    // TODO Try add this to where updates are made and do a GRID TRANSACTION
    this.subs.add(this.updateTableData(this.season()!.id).subscribe());
  }
}
