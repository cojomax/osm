import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { forkJoin, tap } from 'rxjs';
import { Option } from 'src/app/models/option.model';
import { CompetitionService } from 'src/app/services/competition.service';
import { AppCache } from '../../services/app-cache';
import { SeasonService } from '../../services/season.service';
import { compareByIdFn } from '../../shared/utility/form.util';

export type SelectedSeason = {
  seasonId: string;
  competitionId?: string;
};

@Component({
  selector: 'osm-season-selector',
  templateUrl: './season-selector.component.html',
  styleUrls: ['./season-selector.component.css'],
  imports: [CommonModule, NzSelectComponent, FormsModule, NzOptionComponent],
})
export class SeasonSelectorComponent implements OnInit {
  showCompetition = input<boolean>(false);

  // TODO Move this to a service.
  protected readonly isMobile = !!inject(ActivatedRoute).snapshot.parent?.data['mobile'];
  protected readonly cache = inject(AppCache);

  protected seasonOptions = signal<Option[]>([]);
  protected competitionOptions = signal<Option[]>([]);

  protected selectedSeason: string | undefined;
  protected selectedCompetition: string | undefined;

  protected readonly compareByIdFn = compareByIdFn;

  private readonly seasonSvc = inject(SeasonService);
  private readonly competitionSvc = inject(CompetitionService);

  @Output() selected = new EventEmitter<SelectedSeason>();

  ngOnInit() {
    forkJoin([this.seasonSvc.fetch(), this.competitionSvc.fetch()])
      .pipe(
        tap(([seasons]) => {
          this.seasonOptions.set(seasons.map((s) => new Option(s.name, s.id)));
          this.onSeasonSelected(seasons[0].id);
        }),
      )
      .subscribe();
  }

  protected onSeasonSelected(seasonId: string) {
    this.selectedSeason = seasonId;

    const season = this.cache.seasons().find((s) => s.id === seasonId);
    const seasonCompetitions = [season?.league?.competitionId, season?.cup?.competitionId];

    const competitionsOptions = this.cache
      .competitions()
      .filter((c) => seasonCompetitions.includes(c.id))
      .map((c) => new Option(`${c.name} ${c.tier}`, c.id))
      .sort((a, b) => (a.label.includes('Division') ? -1 : 1));

    this.competitionOptions.set(competitionsOptions);
    this.selectedCompetition = competitionsOptions[0].value;

    this.selected.emit({ seasonId: this.selectedSeason, competitionId: this.selectedCompetition });
  }

  protected onCompetitionSelected(competitionId: string) {
    this.selectedCompetition = competitionId;
    this.selected.emit({ seasonId: this.selectedSeason!, competitionId: this.selectedCompetition });
  }
}
