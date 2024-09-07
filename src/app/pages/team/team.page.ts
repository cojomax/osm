import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Player } from '../../domain/player/player.model';
import { PlayerService } from '../../domain/player/player.service';

@Component({
  standalone: true,
  templateUrl: './team.page.html',
  styleUrl: './team.page.css',
  imports: [],
})
export class TeamPageComponent implements OnInit {
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
}
