import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from '@nz/divider';
import { Subscription, tap } from 'rxjs';
import { Player } from '../../api/models/player.model';
import { Position } from '../../models/position.enum';
import { PlayerService } from '../../services/player.service';
import { SwiperComponent } from '../../components/swiper/swiper.component';

@Component({
  imports: [CommonModule, NzDividerModule, SwiperComponent],
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
        .fetch()
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

    this.positionless = players.filter((p) => p.position === Position.Undefined);
  }
}
