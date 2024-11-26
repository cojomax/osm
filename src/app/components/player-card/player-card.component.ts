import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzCardModule } from '@nz/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Player } from '../../models/player.model';

@Component({
    selector: 'app-player-card',
    imports: [NzAvatarModule, CommonModule, NzCardModule],
    templateUrl: './player-card.component.html',
    styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  @Input() player: Player | undefined;
}
