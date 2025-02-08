import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { Subscription, tap } from 'rxjs';
import { Player } from '../../../api/models/player.model';
import { PlayerService } from '../../../services/player.service';
import { PlayerFormComponent } from './form/player.form';
import { EditButtonComponent } from './renderers/edit-btn.component';
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

  private datePipe: DatePipe;
  private subs = new Subscription();

  @ViewChild(GridComponent) grid!: GridComponent<Player>;
  @ViewChild(PlayerFormComponent) form!: PlayerFormComponent;

  constructor(
    protected modalSvc: FormModalService<Player>,
    private playerSvc: PlayerService,
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

  protected colDefs: ColDef<Player>[] = [
    {
      field: 'squadNumber',
      cellDataType: 'number',
      headerName: '#',
      width: 50,
    },
    { field: 'isLegend', headerName: 'Legend' },
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

  /** Handles the add event from the GridComponent. */
  protected onAdd() {
    this.openModal();
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

  protected onModified() {
    // TODO Try add this to where updates are made
    this.subs.add(this.updateTableData().subscribe());
  }
}
