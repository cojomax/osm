import { AfterContentInit, Component, Input } from '@angular/core';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { Player } from '../../models/player.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-swiper',
  templateUrl: './player-swiper.component.html',
  styleUrls: ['./player-swiper.component.css'],
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
})
export class PlayerSwiperComponent implements AfterContentInit {
  @Input() players: Player[] = [];

  ngAfterContentInit() {
    // @ts-ignore
    window['swiper'] = new Swiper('.swiper-player', {
      slidesPerView: 3,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}
