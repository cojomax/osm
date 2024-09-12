import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { NzModalModule } from '@nz/modal';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { finalize, mergeMap, Subscription, tap } from 'rxjs';
import { Player } from '../../../domain/player/player.model';
import { PlayerService } from '../../../domain/player/player.service';
import { EditButtonComponent } from './form/edit-btn/edit-btn.component';
import { PlayerFormComponent } from './form/player.form';

@Component({
  standalone: true,
  imports: [
    AgGridAngular,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    PlayerFormComponent,
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersPageComponent implements OnInit, AfterViewInit {
  protected isSaving = false;
  protected isDeleting = false;
  protected isModalVisible = false;
  protected isSumbitDisabled = true;

  protected selectedPlayer: Player | null = null;
  protected players: Player[] = [];

  private _subs = new Subscription();

  @ViewChild(PlayerFormComponent) form: PlayerFormComponent | undefined;

  constructor(private _playerSvc: PlayerService) {}

  ngOnInit() {
    this.refreshTable().subscribe();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  protected colDefs: ColDef[] = [
    { field: 'squadNumber', headerName: '#' },
    { field: 'firstName', editable: true },
    { field: 'lastName' },
    { field: 'position' },
    {
      field: 'action',
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

    this._subs.add(
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
      ? this._playerSvc.updatePlayer(this.form.playerForm.value)
      : this._playerSvc.addPlayer(new Player(this.form.playerForm.value));

    this._subs.add(
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
    this._playerSvc
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
    return this._playerSvc.getAllPlayers().pipe(
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
