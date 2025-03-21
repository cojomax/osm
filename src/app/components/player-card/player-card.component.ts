import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NzCardModule } from '@nz/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Player } from '../../api/models/player.model';

export enum Statistic {
  Goals = 'Goals',
  Assists = 'Assists',
  CleanSheets = 'Clean Sheets',
}

type Stat = {
  type: Statistic;
  value: number;
};

@Component({
  selector: 'osm-player-card',
  imports: [NzAvatarModule, CommonModule, NzCardModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  player = input<Player | undefined>();
  stats = input<Stat[] | undefined>();

  protected bestStats = computed(() => {
    return this.stats()
      ?.sort((a, b) => b.value - a.value)
      .filter((_, i) => i <= 1)
      .map((stat) => ({ label: stat.type, value: stat.value }));
  });
}
