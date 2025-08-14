import { Component, computed, EventEmitter, inject, input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzDatePickerModule } from '@nz/date-picker';
import { NzFormModule } from '@nz/form';
import { NzIconModule } from '@nz/icon';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { Subscription } from 'rxjs';
import { Competition } from 'src/app/api/models/competition.model';
import { Season } from 'src/app/api/models/season.model';
import { compareByIdFn } from 'src/app/shared/utility/form.util';
import { FormComponent } from '../../../../components/form/form.component';

// FIXME The venue, competition, and opponent fields are not being prepopulated.
// TODO Add MotM, DoD, Match Report. Separate form?

@Component({
  selector: 'osm-season-form',
  templateUrl: './season.form.html',
  styleUrl: './season.form.css',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    FormsModule,
  ],
  // Must be provided to work in the form modal component.
  providers: [{ provide: FormComponent, useExisting: SeasonFormComponent }],
})
export class SeasonFormComponent extends FormComponent implements OnInit, OnDestroy {
  competitions = input<Competition[]>([]);
  seasons = input<Season[]>([]);

  override form!: FormGroup;

  protected competitionOptions = computed(() =>
    this.competitions()
      .filter((c) => !!c.tier)
      .sort((a, b) => a.format.localeCompare(b.format) || a.tier!.localeCompare(b.tier!))
      .map((c) => ({ label: `${c.name} ${c.tier}`, value: c })),
  );

  protected readonly compareByIdFn = compareByIdFn;

  protected override rowSpan = {
    colOne: 6,
    colTwo: 13,
  };

  private readonly subs = new Subscription();

  /** Emitted when the form status changes. */
  @Output() statusChanged = new EventEmitter<boolean>();

  private readonly fb = inject(FormBuilder);

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      competitions: this.fb.array([this.fb.control(null)]),
    });

    this.subs.add(this.form.statusChanges.subscribe(() => this.statusChanged.emit(this.form.valid)));

    this.name?.setValue(this.getNextSeasonName());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected get formCompetitions() {
    return this.form?.get('competitions') as FormArray;
  }

  protected get name() {
    return this.form?.get('name') as FormControl | null;
  }

  protected onAddCompetition(event: Event) {
    event.preventDefault();
    this.formCompetitions.push(this.fb.control(null));
  }

  protected onRemoveCompetition(idx: number, event: Event) {
    event.preventDefault();
    this.formCompetitions.removeAt(idx);
  }

  override reset(season?: Season) {
    // Create FormArray with appropriate controls
    // Map CompetitionAggregate objects to Competition objects for the form
    const competitionControls = season?.competitions?.length
      ? season.competitions.map((compAggregate) => {
          // Find the matching Competition object from the competitionOptions to ensure same reference
          const matchingOption = this.competitionOptions().find(
            (option) => option.value.id === compAggregate.competitionId,
          );
          return this.fb.control(matchingOption?.value || null);
        })
      : [this.fb.control(null)];

    this.form?.reset({
      id: season?.id ?? '',
      name: season?.name ?? this.getNextSeasonName(),
      startDate: season?.startDate ?? null,
      endDate: season?.endDate ?? null,
    });

    this.form?.setControl('competitions', this.fb.array(competitionControls));
  }

  private getNextSeasonName() {
    if (!this.seasons().length) {
      return '';
    }

    const lastSeason = this.seasons().sort((a, b) => b.startDate!.getTime() - a.startDate!.getTime())[0];
    const [startYear, endYear] = lastSeason.name.split('/');
    const nextStartYear = parseInt(startYear) + 1;
    const nextEndYear = parseInt(endYear) + 1;
    return `${nextStartYear}/${nextEndYear}`;
  }
}
