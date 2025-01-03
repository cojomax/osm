import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, LOCALE_ID, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NzButtonModule } from '@nz/button';
import { NzIconModule } from '@nz/icon';
import { Subscription, tap } from 'rxjs';
import { Player } from '../../../api/models/player.model';
import { PlayerService } from '../../../services/player.service';
import { PlayerFormComponent } from './form/player.form';
import { EditButtonComponent } from './renderers/edit-btn/edit-btn.component';
import { ColDef } from 'ag-grid-community';
import { GridComponent } from '../../../components/grid/grid.component';
import { EditModalComponent } from '../../../components/admin/edit-modal/edit-modal.component';

@Component({
  imports: [CommonModule, NzButtonModule, NzIconModule, GridComponent, EditModalComponent, PlayerFormComponent],
  templateUrl: './players.page.html',
  styleUrl: './players.page.css',
})
export class PlayersPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected players = signal<Player[]>([]);
  protected selectedPlayer = signal<Player | null>(null);
  protected isModalVisible = signal(false);

  private datePipe: DatePipe;
  private subs = new Subscription();

  @ViewChild(GridComponent) grid: GridComponent<Player> | undefined;
  @ViewChild(PlayerFormComponent) form: PlayerFormComponent | undefined;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private playerSvc: PlayerService,
  ) {
    this.datePipe = new DatePipe(locale);
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

  protected onEditClick(playerId: string) {
    this.openModal(this.players().find((p) => p.playerId === playerId)!);
  }

  private openModal(player: Player | null = null) {
    this.selectedPlayer.set(player);
    this.isModalVisible.set(true);
  }

  private updateTableData() {
    return this.playerSvc.getAllPlayers().pipe(
      tap((players) => {
        this.players.set(players);
      }),
    );
  }

  onAdd() {
    this.isModalVisible.set(true);
  }

  onDelete() {
    this.isModalVisible.set(false);
  }

  onCancel() {
    this.isModalVisible.set(false);
  }

  onSubmit() {
    this.isModalVisible.set(false);
  }

  onClose() {
    this.selectedPlayer.set(null);
  }
}
