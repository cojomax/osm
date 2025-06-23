import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { mergeMap, Subscription, tap } from 'rxjs';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { FixtureFormComponent } from './form/fixture.form';
import { Fixture } from '../../../api/models/fixture.model';
import { FixtureService } from '../../../services/fixture.service';
import { FormModalComponent } from '../../../components/admin/form-modal/form-modal.component';
import { GridComponent } from '../../../components/grid/grid.component';
import { EditButtonComponent } from '../players/renderers/edit-btn.component';
import { FormModalService } from '../../../components/admin/form-modal/form-modal.service';
import { REPOSITORY_SERVICE } from '../../../components/admin/form-modal/form-modal.token';
import { VenueService } from '../../../services/venue.service';
import { TeamService } from '../../../services/team.service';
import { Name } from '../../../api/models/name.model';
import { Competition } from '../../../api/models/competition.model';
import { CompetitionService } from '../../../services/competition.service';
import { Player } from '../../../api/models/player.model';
import { PlayerService } from '../../../services/player.service';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { Season } from '../../../api/models/season.model';
import { SeasonService } from '../../../services/season.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    NzSelectComponent,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-fixtures.page.html',
  styleUrl: './manage-fixtures.page.css',
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: FixtureService }],
})
export class ManageFixturesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected fixtures = signal<Fixture[]>([]);
  protected venues = signal<Name[]>([]);
  protected teams = signal<Name[]>([]);
  protected competitions = signal<Competition[]>([]);
  protected players = signal<Player[]>([]);
  protected seasons = signal<Season[]>([]);
  protected selectedFixture = signal<Fixture | null>(null);

  protected selectedSeason = '';

  private datePipe: DatePipe;
  private subs = new Subscription();

  @ViewChild(FixtureFormComponent) form!: FixtureFormComponent;

  private seasonSvc = inject(SeasonService);

  constructor(
    protected modalSvc: FormModalService<Fixture>,
    private competitionSvc: CompetitionService,
    private fixtureSvc: FixtureService,
    private playerSvc: PlayerService,
    private teamSvc: TeamService,
    private venuesSvc: VenueService,
  ) {
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

    this.subs.add(
      this.seasonSvc
        .fetch()
        .pipe(
          tap((res) => {
            const seasons = res.sort((a, b) => (a.startDate!.getTime() < b.startDate!.getTime() ? 1 : -1));
            this.seasons.set(seasons);
            this.selectedSeason = seasons[0].id;
          }),
          mergeMap(() => this.updateTableData(this.selectedSeason)),
        )
        .subscribe(),
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected onSeasonSelected(season: string) {
    this.selectedSeason = season;
    this.subs.add(this.updateTableData(this.selectedSeason).subscribe());
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
      field: 'competition',
      cellRenderer: (params: ICellRendererParams<Competition>) => `${params.value?.name} ${params.value?.tier}`,
    },
    { field: 'opponent.name' },
    {
      colId: 'score',
      headerName: 'Score',
      sortable: false,
      valueFormatter: (params) =>
        params.data?.date! > new Date()
          ? ''
          : `${params.data?.goals?.length ?? 0} - ${params.data?.opponentGoals ?? 0}`,
    },
    {
      colId: 'edit',
      maxWidth: 150,
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

  protected openModal(fixture: Fixture | null = null) {
    this.selectedFixture.set(fixture);
    this.modalSvc.openModal(this.selectedFixture());
  }

  private updateTableData(seasonId: string) {
    return this.fixtureSvc.query('season.id', seasonId).pipe(
      tap((fixtures) => {
        this.fixtures.set(fixtures);
      }),
    );
  }

  protected onModified() {
    // TODO Try add this to where updates are made
    this.subs.add(this.updateTableData(this.selectedSeason).subscribe());
  }
}
