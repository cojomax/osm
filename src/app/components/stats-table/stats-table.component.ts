import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { DashIfEmptyPipe } from '../../shared/pipes/dash-if-empty.pipe';

@Component({
  selector: 'osm-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrl: './stats-table.component.css',
  imports: [NgTemplateOutlet, DashIfEmptyPipe],
})
export class StatsTableComponent {
  ordered = input(false);
  data = input<{ stat: string; value: string | number | undefined }[]>();
}
