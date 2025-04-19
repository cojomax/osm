import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { CommonModule } from '@angular/common';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { IS_MOBILE } from '../../services/tokens/is-mobile.token';

@Component({
  selector: 'osm-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.css'],
  imports: [CommonModule, PlayerCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent {
  data = input<PlayerStatistic[]>([]);

  protected isMobile = inject(IS_MOBILE);
}
