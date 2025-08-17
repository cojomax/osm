import { Component, computed, input } from '@angular/core';
import { DashIfEmptyPipe } from '../../shared/pipes/dash-if-empty.pipe';

@Component({
  selector: 'osm-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrl: './stats-table.component.css',
  imports: [DashIfEmptyPipe],
})
export class StatsTableComponent {
  ordered = input(false);
  data = input.required<{ stat: string; value: string | number | undefined }[]>();
  dataMap = computed(() => {
    const map = new Map<number | string, string[]>();
    this.data()
      .filter((d) => d.value !== undefined)
      .forEach((d) => {
        if (!map.has(d.value!)) {
          map.set(d.value!, []);
        }
        map.get(d.value!)?.push(d.stat);
      });
    console.log(map);
    return map;
  });

  dataRankValues = computed(() => [...this.dataMap().keys()]);
}
