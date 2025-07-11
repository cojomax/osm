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
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { NzTimePickerComponent } from '@nz/time-picker';
import { Subscription } from 'rxjs';
import { FormComponent } from '../../../../components/form/form.component';
import { NzDatePickerModule } from '@nz/date-picker';
import { Name } from '../../../../api/models/name.model';
import { Competition } from '../../../../api/models/competition.model';
import { Fixture } from '../../../../api/models/fixture.model';
import { NzIconModule } from '@nz/icon';
import { Player } from '../../../../api/models/player.model';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { compareByIdFn } from '../../../../shared/utility/form.util';

// FIXME The venue, competition, and opponent fields are not being prepopulated.
// TODO Add MotM, DoD, Match Report. Separate form?

@Component({
  selector: 'osm-fixture-form',
  templateUrl: './fixture.form.html',
  styleUrl: './fixture.form.css',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzTimePickerComponent,
    FormsModule,
  ],
  // Must be provided to work in the form modal component.
  providers: [{ provide: FormComponent, useExisting: FixtureFormComponent }],
})
export class FixtureFormComponent extends FormComponent implements OnInit, OnDestroy {
  season = input<Name | null>();
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
      .sort((a, b) => (a.isOwnGoal ? 1 : a.lastName.localeCompare(b.lastName)))
      .map((p) => ({ label: p.isOwnGoal ? `(${p.fullName})` : `${p.fullName}`, value: p })),
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
      season: [null],
      date: [null, Validators.required],
      time: [null],
      venue: [null],
      competition: [null, Validators.required],
      opponent: [null, Validators.required],
      homeGoals: [0, [Validators.min(0), Validators.max(19), Validators.pattern(/^\d+$/)]],
      opponentGoals: [0, [Validators.min(0), Validators.max(19), Validators.pattern(/^\d+$/)]],
      goals: this.fb.array([]),

      // Report details
      // manOfMatch: [this.data?.manOfMatch ?? ''],
      // dickOfDay: [this.data?.dickOfDay ?? ''],
      // matchReport: [this.data?.matchReport ?? ''],
    });

    this.subs.add(this.form.statusChanges.subscribe(() => this.statusChanged.emit(this.form.valid)));
    this.subs.add(this.homeGoals?.valueChanges.subscribe(() => this.updateGoalGroup(this.homeGoals?.value)));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // TODO Signal? Type?
  protected get goals() {
    return this.form?.get('goals') as FormArray;
  }

  protected get homeGoals() {
    return this.form?.get('homeGoals') as FormControl<number> | undefined;
  }

  protected get oppositionGoals() {
    return this.form?.get('opponentGoals');
  }

  protected updateGoalGroup(length: number | undefined) {
    if (length === void 0) {
      return;
    }

    const controls = Array.from({ length }).map(() =>
      this.fb.group({
        scored: [null, Validators.required],
        assisted: [null],
      }),
    );
    this.setGoalControls(controls);
  }

  // protected onRemoveGoalGroup(index: number, e: MouseEvent) {
  //   if (this.goals.length !== 1) {
  //     this.goals.removeAt(index);
  //   }
  // }

  protected onTimePickerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  override reset(fixture?: Fixture) {
    this.form?.reset({
      id: fixture?.id,
      season: fixture?.season ?? this.season(),
      date: fixture?.date ?? null,
      time: fixture?.time ?? null,
      venue: fixture?.venue ?? null,
      competition: fixture?.competition ?? null,
      opponent: fixture?.opponent ?? null,
      homeGoals: fixture?.homeGoals ?? 0,
      opponentGoals: fixture?.opponentGoals ?? 0,
    });

    const goalControlGroups = fixture?.goals?.map((g) =>
      this.fb.group({
        scored: [g.scored],
        assisted: [g.assisted],
      }),
    );
    this.setGoalControls(goalControlGroups ?? []);
  }

  private setGoalControls(controls: FormGroup[]) {
    this.form?.setControl('goals', this.fb.array(controls));
  }
}
