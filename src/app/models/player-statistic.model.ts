import { Player } from '../api/models/player.model';
import { Statistic } from './statistic.model';

export class PlayerStatistic {
  constructor(
    public player: Player,
    public statistics: Statistic[],
  ) {}
}
