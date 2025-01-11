import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzDatePickerModule } from '@nz/date-picker';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { Position } from '../../../../models/position.enum';
import { Match } from '../../../../api/models/match.model';
import { NzTimePickerComponent } from '@nz/time-picker';

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
  ],
})
export class FixtureFormComponent implements OnInit {
  @Input() data: Match | null = null;

  public fixtureForm!: FormGroup<any>;

  protected submitted = new EventEmitter<FormGroup>();

  protected rowSpan = {
    colOne: 6,
    colTwo: 14,
  };

  protected positionOptions = Object.keys(Position).map((key) => ({
    value: Position[key as keyof typeof Position],
    label: Position[key as keyof typeof Position] === Position.Undefined ? '' : Position[key as keyof typeof Position],
  }));

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.fixtureForm = this._fb.group({
      // Fixture details
      matchId: [this.data?.id],
      date: [this.data?.date ?? null, Validators.required],
      time: [this.data?.time ?? null, Validators.required],
      venue: [this.data?.venue ?? '', Validators.required],
      competition: [this.data?.competition ?? '', Validators.required],
      opponent: [this.data?.opponent ?? '', Validators.required],

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
  }
}
