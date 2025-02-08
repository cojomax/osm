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
  protected legends: Player[] = [];

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
    this.goalkeepers = players
      .filter((p) => !p.isLegend && p.position === Position.Goalkeeper)
      .sort((a, b) => (a.squadNumber < b.squadNumber ? -1 : 1));

    this.defenders = players
      .filter((p) => !p.isLegend && p.position === Position.Defender)
      .sort((a, b) => (a.squadNumber < b.squadNumber ? -1 : 1));

    this.midfielders = players
      .filter((p) => !p.isLegend && p.position === Position.Midfielder)
      .sort((a, b) => (a.squadNumber < b.squadNumber ? -1 : 1));

    this.forwards = players
      .filter((p) => !p.isLegend && p.position === Position.Forward)
      .sort((a, b) => (a.squadNumber < b.squadNumber ? -1 : 1));

    this.legends = players.filter((p) => p.isLegend).sort((a, b) => a.lastName.localeCompare(b.lastName));
  }
}
