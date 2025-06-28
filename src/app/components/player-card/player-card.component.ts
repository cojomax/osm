import { Component, input } from '@angular/core';
import { NzCardModule } from '@nz/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { PlayerStatistic } from '../../models/player-statistic.model';

@Component({
  selector: 'osm-player-card',
  imports: [NzAvatarModule, NzCardModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  playerStatistic = input.required<PlayerStatistic>();
}
