import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { compareByIdFn } from '../../shared/utility/form.util';
import { Season } from '../../api/models/season.model';
import { FormsModule } from '@angular/forms';
import { Name } from '../../api/models/name.model';
import { State } from '../../services/state';
import { SeasonService } from '../../services/season.service';
import { first, tap } from 'rxjs';

@Component({
  selector: 'osm-season-selector',
  template: ` <nz-select
    [compareWith]="compareByIdFn"
    (ngModelChange)="onSeasonSelected($event)"
    [ngModel]="selectedSeason"
  >
    @for (season of state.seasons(); track season.id) {
      <nz-option [nzValue]="season" [nzLabel]="season.name"></nz-option>
    }
  </nz-select>`,
  styles: `
    nz-select {
      width: 100%;
    }
  `,
  imports: [NzSelectComponent, FormsModule, NzOptionComponent],
})
export class SeasonSelectorComponent implements OnInit {
  protected readonly state = inject(State);

  protected selectedSeason: Name | undefined;

  protected readonly compareByIdFn = compareByIdFn;

  private readonly seasonSvc = inject(SeasonService);

  @Output() selected = new EventEmitter<string>();

  ngOnInit() {
    this.seasonSvc
      .fetch()
      .pipe(
        first(),
        tap((season) => {
          this.setSelectedSeason(season[0]);
        }),
      )
      .subscribe();
  }

  protected onSeasonSelected(season: Season) {
    this.setSelectedSeason(season);
  }

  private setSelectedSeason(season: Season) {
    this.selectedSeason = new Name({ id: season.id, name: season.name });
    this.selected.emit(this.selectedSeason.id);
  }
}
