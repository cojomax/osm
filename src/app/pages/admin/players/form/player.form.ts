import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { Player } from '../../../../models/player.model';

@Component({
  selector: 'app-player-form',
  templateUrl: './player.form.html',
  styleUrl: './player.form.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
  ],
})
export class PlayerFormComponent implements OnInit {
  @Input() data: Player | null = null;

  playerForm!: FormGroup<any>;

  protected submitted = new EventEmitter<FormGroup>();

  protected rowSpan = {
    colOne: 6,
    colTwo: 14,
  };

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

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.playerForm = this._fb.group({
      playerId: [this.data?.playerId],
      firstName: [this.data?.firstName ?? '', Validators.required],
      lastName: [this.data?.lastName ?? '', Validators.required],
      position: [this.data?.position ?? '', Validators.required],
      squadNumber: [this.data?.squadNumber ?? null, Validators.required],
    });
  }

  onSubmit() {
    this.submitted.emit(this.playerForm);
    // this._playerSvc
    //   .addPlayer(new Player(this.playerForm.value))
    //   .pipe(
    //     tap((res) => {
    //       alert('done');
    //     }),
    //   )
    //   .subscribe();
  }
}
