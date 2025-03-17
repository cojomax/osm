import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzCardModule } from '@nz/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Player } from '../../api/models/player.model';

@Component({
  selector: 'osm-player-card',
  imports: [NzAvatarModule, CommonModule, NzCardModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  player = input<Player | undefined>();
}
