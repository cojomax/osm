import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { AgGridAngular } from 'ag-grid-angular';
import { finalize, mergeMap, Subscription, tap } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { FixtureFormComponent } from './form/fixture.form';
import { Match } from '../../../api/models/match.model';
import { MatchService } from '../../../services/match.service';

@Component({
  imports: [AgGridAngular, NzButtonModule, NzIconModule, NzModalModule, FixtureFormComponent],
  templateUrl: './matches.page.html',
  styleUrl: './matches.page.css',
})
export class MatchesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected isSaving = false;
  protected isDeleting = false;
  protected isModalVisible = false;
  protected isSubmitDisabled = true;

  protected selectedMatch: Match | null = null;
  protected matches: Match[] = [];

  private subs = new Subscription();
  private datePipe: DatePipe;

  @ViewChild(FixtureFormComponent) form: FixtureFormComponent | undefined;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private matchSvc: MatchService,
  ) {
    this.datePipe = new DatePipe(locale);
  }

  ngOnInit() {
    this.refreshTable().subscribe();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected colDefs: ColDef[] = [
    { field: 'date' },
    { field: 'time' },
    { field: 'venue' },
    { field: 'competition' },
    { field: 'opponent' },
    {},
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

  protected onEditClick(matchId: string) {
    this.openModal(this.matches.find((p) => p.id === matchId)!);
  }

  protected onAddClick() {
    this.openModal();
  }

  protected onModalOpen() {
    this.isSubmitDisabled = this.form?.fixtureForm.invalid ?? true;

    this.subs.add(
      this.form!.fixtureForm.statusChanges.pipe(
        tap(() => {
          this.isSubmitDisabled = this.form!.fixtureForm.invalid;
        }),
      ).subscribe(),
    );
  }

  protected onSubmit() {
    if (!this.form) {
      return;
    }

    this.isSaving = true;

    const write$ = this.form.fixtureForm.get('matchId')?.value
      ? this.matchSvc.updateMatch(this.form.fixtureForm.value)
      : this.matchSvc.addMatch(new Match(this.form.fixtureForm.value));

    this.subs.add(
      write$
        .pipe(
          mergeMap(() => this.refreshTable()),
          finalize(() => {
            this.closeModal();
            this.isSaving = false;
          }),
        )
        .subscribe(),
    );
  }

  protected onDelete() {
    this.isDeleting = true;
    this.matchSvc
      .deleteMatch(this.selectedMatch!.id)
      .pipe(
        mergeMap(() => this.refreshTable()),
        finalize(() => {
          this.closeModal();
          this.isDeleting = false;
        }),
      )
      .subscribe();
  }

  protected onCancel() {
    this.closeModal();
  }

  protected onModalClose() {
    this.selectedMatch = null;
  }

  private refreshTable() {
    return this.matchSvc.getAllMatches().pipe(
      tap((matches) => {
        this.matches = matches;
      }),
    );
  }

  private openModal(match: Match | null = null) {
    this.selectedMatch = match;
    this.isModalVisible = true;
  }

  private closeModal() {
    this.isModalVisible = false;
  }
}
