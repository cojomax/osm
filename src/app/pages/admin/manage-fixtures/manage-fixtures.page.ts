import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { Subscription, tap } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { FixtureFormComponent } from './form/fixture.form';
import { Fixture } from '../../../api/models/fixture.model';
import { FixtureService } from '../../../services/fixture.service';
import { FormModalComponent } from '../../../components/admin/form-modal/form-modal.component';
import { GridComponent } from '../../../components/grid/grid.component';
import { EditButtonComponent } from '../players/renderers/edit-btn.component';
import { FormModalService } from '../../../components/admin/form-modal/form-modal.service';
import { REPOSITORY_SERVICE } from '../../../components/admin/form-modal/form-modal.token';

@Component({
  imports: [NzButtonModule, NzIconModule, NzModalModule, FixtureFormComponent, FormModalComponent, GridComponent],
  templateUrl: './manage-fixtures.page.html',
  styleUrl: './manage-fixtures.page.css',
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: FixtureService }],
})
export class ManageFixturesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected fixtures = signal<Fixture[]>([]);
  protected selectedFixture = signal<Fixture | null>(null);

  private datePipe: DatePipe;
  private subs = new Subscription();

  @ViewChild(FixtureFormComponent) form!: FixtureFormComponent;

  constructor(
    protected modalSvc: FormModalService<Fixture>,
    private matchSvc: FixtureService,
  ) {
    this.datePipe = new DatePipe(inject(LOCALE_ID));
  }

  ngOnInit() {
    this.subs.add(this.updateTableData().subscribe());
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected colDefs: ColDef<Fixture>[] = [
    {
      field: 'date',
      cellDataType: 'date',
      width: 250,
      valueFormatter: (params) => this.datePipe.transform(params.value, 'fullDate') ?? '',
    },
    {
      field: 'time',
      cellDataType: 'date',
      valueFormatter: (params) => this.datePipe.transform(params.value, 'shortTime') ?? '',
    },
    { field: 'venue' },
    // { field: 'competition' },
    { field: 'opponent' },
    {
      colId: 'score',
      headerName: 'Score',
      valueFormatter: (params) => `${params.data?.homeScore ?? 0} - ${params.data?.opponentScore ?? 0}`,
    },
    {
      colId: 'edit',
      maxWidth: 150,
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

  protected onEditClick(matchId: string) {
    this.openModal(this.fixtures().find((f) => f.id === matchId)!);
  }

  protected openModal(fixture: Fixture | null = null) {
    this.selectedFixture.set(fixture);
    this.modalSvc.openModal(this.selectedFixture());
  }

  private updateTableData() {
    return this.matchSvc.fetch().pipe(
      tap((fixtures) => {
        this.fixtures.set(fixtures);
      }),
    );
  }

  protected onModified() {
    // TODO Try add this to where updates are made
    this.subs.add(this.updateTableData().subscribe());
  }
}
