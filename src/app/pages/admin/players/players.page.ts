import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { finalize, mergeMap, Subscription, tap } from 'rxjs';
import { Player } from '../../../models/player.model';
import { PlayerService } from '../../../services/player.service';
import { PlayerFormComponent } from './form/player.form';
import { EditButtonComponent } from './renderers/edit-btn/edit-btn.component';

@Component({
  standalone: true,
  imports: [
    AgGridAngular,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    PlayerFormComponent,
  ],
  templateUrl: './players.page.html',
  styleUrl: './players.page.css',
})
export class PlayersPageComponent implements OnInit, AfterViewInit {
  protected isSaving = false;
  protected isDeleting = false;
  protected isModalVisible = false;
  protected isSumbitDisabled = true;

  protected selectedPlayer: Player | null = null;
  protected players: Player[] = [];

  private subs = new Subscription();
  private datePipe: DatePipe;

  @ViewChild(PlayerFormComponent) form: PlayerFormComponent | undefined;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private playerSvc: PlayerService,
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
    {
      field: 'squadNumber',
      cellDataType: 'number',
      headerName: '#',
      width: 50,
    },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'position' },
    { field: 'country' },
    {
      field: 'dob',
      cellDataType: 'date',
      headerName: 'Date of Birth',
      width: 150,
      valueFormatter: (params) => this.datePipe.transform(params.value) ?? '',
    },
    {
      field: 'height',
      cellDataType: 'number',
      headerName: 'Height (cm)',
      width: 150,
    },
    {
      field: 'action',
      maxWidth: 150,
      cellRenderer: EditButtonComponent,
      cellRendererParams: { onEdit: this.onEditClick.bind(this) },
    },
  ];

  protected onEditClick(playerId: string) {
    this.openModal(this.players.find((p) => p.playerId === playerId)!);
  }

  protected onAddClick() {
    this.openModal();
  }

  protected onModalOpen() {
    this.isSumbitDisabled = this.form?.playerForm.invalid ?? true;

    this.subs.add(
      this.form!.playerForm.statusChanges.pipe(
        tap(() => {
          this.isSumbitDisabled = this.form!.playerForm.invalid;
        }),
      ).subscribe(),
    );
  }

  protected onSubmit() {
    if (!this.form) {
      return;
    }

    this.isSaving = true;

    const write$ = this.form.playerForm.get('playerId')?.value
      ? this.playerSvc.updatePlayer(this.form.playerForm.value)
      : this.playerSvc.addPlayer(new Player(this.form.playerForm.value));

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
    this.playerSvc
      .deletePlayer(this.selectedPlayer!.playerId)
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
    this.selectedPlayer = null;
  }

  private refreshTable() {
    return this.playerSvc.getAllPlayers().pipe(
      tap((players) => {
        this.players = players;
      }),
    );
  }

  private openModal(player: Player | null = null) {
    this.selectedPlayer = player;
    this.isModalVisible = true;
  }

  private closeModal() {
    this.isModalVisible = false;
  }
}
