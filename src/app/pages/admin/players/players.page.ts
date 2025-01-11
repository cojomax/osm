import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { Subscription, tap } from 'rxjs';
import { Player } from '../../../api/models/player.model';
import { PlayerService } from '../../../services/player.service';
import { PlayerFormComponent } from './form/player.form';
import { EditButtonComponent } from './renderers/edit-btn/edit-btn.component';
import { ColDef } from 'ag-grid-community';
import { GridComponent } from '../../../components/grid/grid.component';
import { REPOSITORY_SERVICE } from '../../../components/admin/form-modal/form-modal.token';
import { FormModalComponent } from '../../../components/admin/form-modal/form-modal.component';
import { FormModalService } from '../../../components/admin/form-modal/form-modal.service';

@Component({
  imports: [CommonModule, NzButtonModule, NzIconModule, GridComponent, PlayerFormComponent, FormModalComponent],
  templateUrl: './players.page.html',
  styleUrl: './players.page.css',
  providers: [FormModalService, { provide: REPOSITORY_SERVICE, useExisting: PlayerService }],
})
export class PlayersPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected players = signal<Player[]>([]);
  protected selectedPlayer = signal<Player | null>(null);
  protected isFormValid = signal(false);

  private datePipe: DatePipe;
  private subs = new Subscription();

  // TODO Remove undefined?
  @ViewChild(GridComponent) grid: GridComponent<Player> | undefined;
  @ViewChild(PlayerFormComponent) form: PlayerFormComponent | undefined;

  constructor(
    protected modalSvc: FormModalService<Player>,
    private playerSvc: PlayerService,
  ) {
    // TODO Confirm this is change was right
    this.datePipe = new DatePipe(inject(LOCALE_ID));
  }

  ngOnInit() {
    this.subs.add(this.updateTableData().subscribe());
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected colDefs: ColDef<Player>[] = [
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
      colId: 'action',
      maxWidth: 150,
      cellRenderer: EditButtonComponent,
      cellRendererParams: { onEdit: this.onEditClick.bind(this) },
    },
  ];

  protected onFormUpdated(isValid: boolean) {
    this.isFormValid.set(isValid);
  }

  protected onEditClick(playerId: string) {
    this.openModal(this.players().find((p) => p.id === playerId)!);
  }

  private openModal(player: Player | null = null) {
    this.selectedPlayer.set(player);
    this.modalSvc.openModal(this.selectedPlayer());
  }

  private updateTableData() {
    return this.playerSvc.fetch().pipe(
      tap((players) => {
        this.players.set(players);
      }),
    );
  }

  /** Handles the add event from the GridComponent. */
  onAdd() {
    this.openModal();
  }

  onClose() {
    this.selectedPlayer.set(null);
  }

  protected onModified() {
    // TODO Try add this to where updates are made
    this.subs.add(this.updateTableData().subscribe());
  }
}
