import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, Signal, signal } from '@angular/core';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { CommonModule } from '@angular/common';
import { IS_MOBILE } from '../../services/tokens/device-detection.token';
import { PlayerStatistic } from '../../models/player-statistic.model';

@Component({
  selector: 'osm-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.css'],
  imports: [CommonModule, PlayerCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent {
  data = input<PlayerStatistic[]>([]);

  protected slidesPerView = signal<'auto' | 3>(3);
  protected centeredSlides = signal(false);
  protected isMobile: Signal<boolean>;

  constructor() {
    effect(() => {
      this.slidesPerView.set(this.isMobile() ? 'auto' : 3);
      this.centeredSlides.set(this.isMobile());
    });

    this.isMobile = signal(inject(IS_MOBILE)).asReadonly();
  }
}
