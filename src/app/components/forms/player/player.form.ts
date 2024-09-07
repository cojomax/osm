import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzFormModule } from '@nz/form';
import { tap } from 'rxjs';
import { Player } from '../../../domain/player/player.model';
import { PlayerService } from '../../../domain/player/player.service';

@Component({
  selector: 'osm-player-form',
  templateUrl: './player.form.html',
  styleUrl: './player.form.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzButtonModule, NzFormModule],
})
export class PlayerFormComponent implements OnInit {
  protected playerForm!: FormGroup<any>;

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
    private _playerSvc: PlayerService,
  ) {}

  ngOnInit() {
    this.playerForm = this._fb.group({
      // playerId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      squadNumber: [null, Validators.required],
    });
  }

  protected players: Player[] = [];

  onSubmit() {
    this._playerSvc
      .addPlayer(new Player(this.playerForm.value))
      .pipe(
        tap((res) => {
          alert('done');
        }),
      )
      .subscribe();
  }
}
