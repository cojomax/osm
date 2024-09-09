import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { tap } from 'rxjs';
import { Player } from 'src/app/domain/player/player.model';
import { PlayerService } from 'src/app/domain/player/player.service';
import { PlayerFormComponent } from '../../../components/forms/player/player.form';

@Component({
  standalone: true,
  imports: [AgGridAngular, PlayerFormComponent],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersPageComponent {
  protected players: Player[] = [];

  constructor(private _playerSvc: PlayerService) {}

  ngOnInit() {
    this._playerSvc
      .getAllPlayers()
      .pipe(
        tap((players) => {
          this.players = players;
        }),
      )
      .subscribe();
  }

  protected colDefs: ColDef[] = [
    { field: 'squadNumber', headerName: '#' },
    { field: 'firstName', editable: true },
    { field: 'lastName' },
    { field: 'position' },
  ];
}
