import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { forkJoin, tap } from 'rxjs';
import { Option } from 'src/app/models/option.model';
import { CompetitionService } from 'src/app/services/competition.service';
import { isStr } from 'src/app/shared/utility/string.util';
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

  private readonly allSeasonOption = new Option('all', 'All Seasons');
  private readonly allCompetitionOption = new Option('all', 'All Competitions');

  private readonly seasonSvc = inject(SeasonService);
  private readonly competitionSvc = inject(CompetitionService);

  @Output() selected = new EventEmitter<SelectedSeason>();

  ngOnInit() {
    forkJoin([this.seasonSvc.fetch(), this.competitionSvc.fetch()])
      .pipe(
        tap(([seasons]) => {
          this.seasonOptions.set(seasons.map((s) => new Option(s.id, s.name)));
          this.onSeasonSelected(seasons[0].id);
          this.seasonOptions.update((s) => [this.allSeasonOption, ...s]);
        }),
      )
      .subscribe();
  }

  protected onSeasonSelected(seasonId: string) {
    this.selectedSeason = seasonId;

    this.setCompetitionOptions(this.selectedSeason);
    this.selectedCompetition = this.competitionOptions()[0]?.value;

    this.selected.emit({ seasonId: this.selectedSeason, competitionId: this.selectedCompetition });
  }

  protected onCompetitionSelected(competitionId: string) {
    this.selectedCompetition = competitionId;
    this.selected.emit({ seasonId: this.selectedSeason!, competitionId: this.selectedCompetition });
  }

  private setCompetitionOptions(seasonId: string) {
    let options: Option[] = [];

    if (seasonId === 'all') {
      options = this.cache
        .competitions()
        .filter((c) => isStr(c.format).oneOfIgnoreCase('league', 'cup'))
        .sort((a, b) => (a.format === 'League' ? -1 : 1))
        .map((c) => new Option(c.id, `${c.name} ${c.tier}`));
      options = [this.allCompetitionOption, ...options];
    } else {
      const season = this.cache.seasons().find((s) => s.id === seasonId);
      options = season?.competitions.map((c) => new Option(c.competitionId, `${c.name} ${c.tier}`)) ?? [];
    }

    this.competitionOptions.set(options);
  }
}
