import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NzCardComponent } from '@nz/card';
import { NzTagComponent } from '@nz/tag';
import { Fixture } from 'src/app/api/models/fixture.model';
import { MatchesPageService } from '../match-pages.service';

@Component({
  selector: 'osm-fixture-card',
  templateUrl: './fixture-card.component.html',
  styleUrl: './fixture-card.component.css',
  imports: [DatePipe, NgOptimizedImage, NzCardComponent, NzTagComponent],
})
export class FixtureCardComponent {
  fixture = input.required<Fixture>();

  protected icon = computed(() => `/assets/icons/${this.fixture().played ? 'football-primary' : 'pitch-primary'}.svg`);

  protected matchSvc = inject(MatchesPageService);
}
