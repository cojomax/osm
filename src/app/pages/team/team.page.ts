import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from '@nz/divider';
import { Subscription, tap } from 'rxjs';
import { Player } from '../../models/player.model';
import { Position } from '../../models/position.enum';
import { PlayerService } from '../../services/player.service';
import { PlayerSwiperComponent } from '../../components/player-swiper/player-swiper.component';

@Component({
  imports: [CommonModule, NzDividerModule, PlayerSwiperComponent],
  templateUrl: './team.page.html',
  styleUrl: './team.page.css',
})
export class TeamPageComponent implements OnInit {
  protected goalkeepers: Player[] = [];
  protected defenders: Player[] = [];
  protected midfielders: Player[] = [];
  protected forwards: Player[] = [];
  protected positionless: Player[] = [];

  private subs = new Subscription();

  constructor(private playerSvc: PlayerService) {}

  ngOnInit() {
    this.subs.add(
      this.playerSvc
        .getAllPlayers()
        .pipe(
          tap((result) => {
            this.filterByPosition(result);
          }),
        )
        .subscribe(),
    );
  }

  private filterByPosition(players: Player[]) {
    this.goalkeepers = [
      ...players.filter((p) => p.position === Position.Goalkeeper),
      ...players.filter((p) => p.position === Position.Goalkeeper),
      ...players.filter((p) => p.position === Position.Goalkeeper),
      ...players.filter((p) => p.position === Position.Goalkeeper),
      ...players.filter((p) => p.position === Position.Goalkeeper),
      ...players.filter((p) => p.position === Position.Goalkeeper),
    ];

    this.defenders = [
      ...players.filter((p) => p.position === Position.Defender),
      ...players.filter((p) => p.position === Position.Defender),
      ...players.filter((p) => p.position === Position.Defender),
      ...players.filter((p) => p.position === Position.Defender),
      ...players.filter((p) => p.position === Position.Defender),
      ...players.filter((p) => p.position === Position.Defender),
    ];

    this.midfielders = [
      ...players.filter((p) => p.position === Position.Midfielder),
      ...players.filter((p) => p.position === Position.Midfielder),
      ...players.filter((p) => p.position === Position.Midfielder),
      ...players.filter((p) => p.position === Position.Midfielder),
      ...players.filter((p) => p.position === Position.Midfielder),
      ...players.filter((p) => p.position === Position.Midfielder),
    ];

    this.positionless = players.filter(
      (p) => p.position === Position.Undefined,
    );
  }
}
