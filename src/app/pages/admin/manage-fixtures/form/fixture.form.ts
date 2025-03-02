import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Fixture } from '../../../../api/models/fixture.model';
import { NzIconModule } from '@nz/icon';
import { Player } from '../../../../api/models/player.model';

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
    NzIconModule,
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
  players = input<Player[]>([]);

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

  playerOptions = computed(() =>
    this.players()
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .map((player) => ({ label: `${player.firstName} ${player.lastName}`, value: player })),
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

  private subs = new Subscription();

  /** Emitted when the form status changes. */
  @Output() statusChanged = new EventEmitter<boolean>();

  private _fb = inject(FormBuilder);

  ngOnInit() {
    this.form = this._fb.group({
      id: [''],
      date: [null, Validators.required],
      time: [null],
      venue: [null, Validators.required],
      competition: [null, Validators.required],
      opponent: [null, Validators.required],

      goals: this._fb.array([
        this._fb.group({
          scored: [null],
          assisted: [null],
        }),
      ]),

      // Report details
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

  // TODO Signal? Type?
  protected get goals() {
    return this.form?.get('goals') as FormArray;
  }

  protected onAddGoalGroup(e?: MouseEvent) {
    this.goals.push(
      this._fb.group({
        scored: [null],
        assisted: [null],
      }),
    );
  }

  protected onRemoveGoalGroup(index: number, e: MouseEvent) {
    if (this.goals.length !== 1) {
      this.goals.removeAt(index);
    }
  }

  protected compareByIdFn(a: Name | Competition | Player, b: Name | Competition | Player) {
    return a && b ? a.id === b.id : a === b;
  }

  override reset(fixture?: Fixture) {
    // this.goals?.clear();
    const emptyGoals = [this._fb.group({ scored: null, assisted: null })];
    const test: FormGroup[] =
      fixture?.goals.map((g) =>
        this._fb.group({
          scored: [g.scored],
          assisted: [g.assisted],
        }),
      ) ?? emptyGoals;

    this.form?.reset({
      id: fixture?.id,
      date: fixture?.date ?? null,
      time: fixture?.time ?? null,
      venue: fixture?.venue ?? null,
      competition: fixture?.competition ?? null,
      opponent: fixture?.opponent ?? null,
      // TODO Figure out types...
      // FIXME Not loading existing goals..
      goals: emptyGoals,
    });
  }
}
