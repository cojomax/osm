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
import { NzTimePickerComponent } from '@nz/time-picker';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { Subscription } from 'rxjs';
import { Competition } from '../../../../api/models/competition.model';
import { Fixture } from '../../../../api/models/fixture.model';
import { Name } from '../../../../api/models/name.model';
import { Player } from '../../../../api/models/player.model';
import { FormComponent } from '../../../../components/form/form.component';
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
    NzCheckboxComponent,
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
      penalties: [false],
      penaltiesHome: [0, [Validators.min(0), Validators.max(19), Validators.pattern(/^\d+$/)]],
      penaltiesOpponent: [0, [Validators.min(0), Validators.max(19), Validators.pattern(/^\d+$/)]],
      forfeit: [false],

      // Report details
      // manOfMatch: [this.data?.manOfMatch ?? ''],
      // dickOfDay: [this.data?.dickOfDay ?? ''],
      // matchReport: [this.data?.matchReport ?? ''],
    });

    this.subs.add(this.form.statusChanges.subscribe(() => this.statusChanged.emit(this.form.valid)));
    this.subs.add(this.homeGoals?.valueChanges.subscribe((value) => this.updateGoalGroup(value)));
    this.subs.add(this.forfeit?.valueChanges.subscribe((value) => this.onForfeitChange(value)));
    this.subs.add(this.penalties?.valueChanges.subscribe((value) => this.onPenaltiesChange(value)));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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
      forfeit: fixture?.forfeit ?? false,
      penalties: fixture?.penalties ?? false,
      penaltiesHome: fixture?.penaltiesHome ?? 0,
      penaltiesOpponent: fixture?.penaltiesOpponent ?? 0,
    });

    const goalControlGroups = fixture?.goals?.map((g) =>
      this.fb.group({
        scored: [g.scored],
        assisted: [g.assisted],
      }),
    );
  }

  // TODO Signal? Type?
  protected get goals() {
    return this.form?.get('goals') as FormArray;
  }

  protected get forfeit() {
    return this.form?.get('forfeit') as FormControl<boolean>;
  }

  protected get penalties() {
    return this.form?.get('penalties') as FormControl<boolean>;
  }

  protected onTimePickerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  private get homeGoals() {
    return this.form?.get('homeGoals') as FormControl<number> | undefined;
  }

  private get penaltiesHome() {
    return this.form?.get('penaltiesHome') as FormControl<number | undefined>;
  }

  private get penaltiesOpponent() {
    return this.form?.get('penaltiesOpponent') as FormControl<number | undefined>;
  }

  private updateGoalGroup(length: number | undefined) {
    if (length === void 0 || this.forfeit.value) {
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

  private setGoalControls(controls: FormGroup[]) {
    this.form?.setControl('goals', this.fb.array(controls));
  }

  private onForfeitChange(forfeit: boolean) {
    if (forfeit) {
      this.setGoalControls([]);
    } else {
      this.updateGoalGroup(this.homeGoals?.value);
    }
  }

  private onPenaltiesChange(show: boolean) {
    this.penaltiesHome.setValue(show ? 0 : void 0);
    this.penaltiesOpponent.setValue(show ? 0 : void 0);
  }
}
