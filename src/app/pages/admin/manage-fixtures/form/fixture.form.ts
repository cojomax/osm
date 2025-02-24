import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { NzTimePickerComponent } from '@nz/time-picker';
import { Subscription, tap } from 'rxjs';
import { FormComponent } from '../../../../components/form/form.component';
import { NzDatePickerModule } from '@nz/date-picker';
import { Name } from '../../../../api/models/name.model';
import { Competition } from '../../../../api/models/competition.model';

@Component({
  selector: 'app-fixture-form',
  templateUrl: './fixture.form.html',
  styleUrl: './fixture.form.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTimePickerComponent,
    FormsModule,
  ],
  // Must be provided to work in the form modal component.
  providers: [{ provide: FormComponent, useExisting: FixtureFormComponent }],
})
export class FixtureFormComponent extends FormComponent implements OnInit, OnDestroy {
  venues = input<Name[]>([]);
  teams = input<Name[]>([]);
  competitions = input<Competition[]>([]);

  venueOptions = computed(() =>
    this.venues()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((venue) => ({ label: venue.name, value: venue })),
  );

  teamOptions = computed(() =>
    this.teams()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((team) => ({ label: team.name, value: team })),
  );

  competitionOptions = computed(() =>
    this.competitions()
      .map((competition) => {
        let option = '';

        if (competition.format === 'League') {
          option = `${competition.tier}`;
        }

        if (competition.format === 'Cup') {
          option = `${competition.name} ${competition.tier}`;
        }

        if (competition.format === 'Exhibition') {
          option = competition.name;
        }

        return { label: option, value: competition };
      })
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  form!: FormGroup;

  protected test = new Date();

  private subs = new Subscription();

  /** Emitted when the form status changes. */
  @Output() statusChanged = new EventEmitter<boolean>();

  constructor(private _fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this._fb.group({
      id: [void 0],
      date: [null, Validators.required],
      time: [null],
      venue: [null, Validators.required],
      competition: [null, Validators.required],
      opponent: [null, Validators.required],

      // Report details
      // homeScore: [this.data?.homeScore ?? 0, [Validators.min(0), Validators.max(29), Validators.pattern(/^\d+$/)]],
      // opponentScore: [
      //   this.data?.opponentScore ?? 0,
      //   [Validators.min(0), Validators.max(29), Validators.pattern(/^\d+$/)],
      // ],
      // manOfMatch: [this.data?.manOfMatch ?? ''],
      // dickOfDay: [this.data?.dickOfDay ?? ''],
      // matchReport: [this.data?.matchReport ?? ''],
    });

    this.subs.add(
      this.form.statusChanges
        .pipe(
          tap(() => {
            this.statusChanged.emit(this.form.valid);
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected compareByIdFn(a: Name | Competition, b: Name | Competition) {
    return a && b ? a.id === b.id : a === b;
  }
}
