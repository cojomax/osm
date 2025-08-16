import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { forkJoin, tap } from 'rxjs';
import { Option } from 'src/app/models/option.model';
import { CompetitionService } from 'src/app/services/competition.service';
import { isString } from 'src/app/shared/utility/string.util';
import { AppCache } from '../../services/app-cache';
import { SeasonService } from '../../services/season.service';
import { compareByIdFn } from '../../shared/utility/form.util';

export type SeasonSelection = {
  seasonId: string;
  competitionId: string;
};

@Component({
  selector: 'osm-season-selector',
  templateUrl: './season-selector.component.html',
  styleUrls: ['./season-selector.component.css'],
  imports: [CommonModule, NzSelectComponent, FormsModule, NzOptionComponent],
})
export class SeasonSelectorComponent implements OnInit {
  showCompetition = input<boolean>(false);
  seasonId = input<string>();
  competitionId = input<string>();

  protected seasonOptions = signal<Option[]>([]);
  protected competitionOptions = signal<Option[]>([]);

  protected selectedSeasonId = 'all';
  protected selectedCompetitionId = 'all';

  // TODO Move this to a service.
  protected readonly isMobile = !!inject(ActivatedRoute).snapshot.parent?.data['mobile'];
  protected readonly cache = inject(AppCache);
  protected readonly compareByIdFn = compareByIdFn;

  private readonly allSeasonOption = new Option('all', 'All Seasons');
  private readonly allCompetitionOption = new Option('all', 'All Competitions');

  private readonly seasonSvc = inject(SeasonService);
  private readonly competitionSvc = inject(CompetitionService);

  @Output() selected = new EventEmitter<SeasonSelection>();

  ngOnInit() {
    forkJoin([this.seasonSvc.fetch(), this.competitionSvc.fetch()])
      .pipe(
        tap(([seasons]) => {
          this.seasonOptions.set([this.allSeasonOption, ...seasons.map((s) => new Option(s.id, s.name))]);
          if (this.seasonId() || this.competitionId()) {
            this.onSeasonSelected(this.seasonId() ?? 'all');
            this.setCompetitionOptions(this.selectedSeasonId);
            this.selectedCompetitionId = this.competitionId() ?? 'all';
            this.emit();
          } else {
            this.onSeasonSelected(this.seasonOptions()[0].value);
          }
        }),
      )
      .subscribe();
  }

  protected onSeasonSelected(seasonId: string) {
    this.selectedSeasonId = seasonId;

    this.setCompetitionOptions(this.selectedSeasonId);
    this.selectedCompetitionId = this.competitionOptions()[0]?.value;

    this.emit();
  }

  protected onCompetitionSelected(competitionId: string) {
    this.selectedCompetitionId = competitionId;
    this.emit();
  }

  private setCompetitionOptions(seasonId: string) {
    let seasonOptions: Option[] = [];

    if (seasonId === 'all') {
      seasonOptions = this.cache
        .competitions()
        .filter((c) => isString(c.format).oneOfIgnoreCase('league', 'cup'))
        .sort((a, b) => (a.format === 'League' ? -1 : 1))
        .map((c) => new Option(c.id, `${c.name} ${c.tier}`));
    } else {
      const cachedSeason = this.cache.seasons().find((s) => s.id === seasonId);
      seasonOptions = cachedSeason?.competitions.map((c) => new Option(c.competitionId, `${c.name} ${c.tier}`)) ?? [];
    }

    this.competitionOptions.set([this.allCompetitionOption, ...seasonOptions]);
  }

  private emit() {
    this.selected.emit({ seasonId: this.selectedSeasonId, competitionId: this.selectedCompetitionId });
  }
}
