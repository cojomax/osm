import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzDatePickerModule } from '@nz/date-picker';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { Player } from '../../../../models/player.model';
import { Position } from '../../../../models/position.enum';

@Component({
  selector: 'app-player-form',
  templateUrl: './player.form.html',
  styleUrl: './player.form.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
})
export class PlayerFormComponent implements OnInit {
  @Input() data: Player | null = null;

  public playerForm!: FormGroup<any>;

  protected submitted = new EventEmitter<FormGroup>();

  protected rowSpan = {
    colOne: 6,
    colTwo: 14,
  };

  protected positionOptions = Object.keys(Position).map((key) => ({
    value: Position[key as keyof typeof Position],
    label:
      Position[key as keyof typeof Position] === Position.Undefined
        ? ''
        : Position[key as keyof typeof Position],
  }));

  get isFirstNameValid() {
    return (
      this.playerForm.get('firstName')?.touched &&
      this.playerForm.get('firstName')?.invalid
    );
  }

  get isLastNameValid() {
    return (
      this.playerForm.get('lastName')?.touched &&
      this.playerForm.get('lastName')?.invalid
    );
  }

  get isPositionValid() {
    return (
      this.playerForm.get('position')?.touched &&
      this.playerForm.get('position')?.invalid
    );
  }

  get isSquadNumberValid() {
    return (
      this.playerForm.get('squadNumber')?.touched &&
      this.playerForm.get('squadNumber')?.invalid
    );
  }

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.playerForm = this._fb.group({
      playerId: [this.data?.playerId],
      firstName: [this.data?.firstName ?? '', Validators.required],
      lastName: [this.data?.lastName ?? '', Validators.required],
      position: [this.data?.position ?? void 0],
      squadNumber: [
        this.data?.squadNumber ?? null,
        [Validators.min(0), Validators.max(99), Validators.pattern(/^\d+$/)],
      ],
      country: [this.data?.country ?? '', Validators.required],
      dob: [this.data?.dob ?? null],
      height: [
        this.data?.height ?? null,
        [Validators.min(150), Validators.max(244), Validators.pattern(/^\d+$/)],
      ],
    });
  }

  onSubmit() {
    this.submitted.emit(this.playerForm);
  }
}
