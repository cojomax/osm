import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatchService } from '../../domain/match/match.service';
import { Player } from '../../domain/player/player.model';
import { MatchReport } from '../../models/match-report.model';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './match-report.page.html',
  styleUrl: './match-report.page.css',
})
export class MatchReportPageComponent implements OnInit {
  protected matchForm!: FormGroup<any>;
  constructor(
    private _fb: FormBuilder,
    private _matchSvc: MatchService,
  ) {}

  ngOnInit() {
    this.matchForm = this._fb.group({
      matchDetails: this._fb.group({
        date: [null, [Validators.required]],
        kickoff: ['', [Validators.required]],
        location: ['', [Validators.required]],
      }),
      opposition: this._fb.group({
        name: ['', [Validators.required]],
        goals: [0, [Validators.required]],
      }),
      osm: this._fb.group({
        kit: this._fb.control<'Home' | 'Away' | null>(null, [
          Validators.required,
        ]),
        goals: [0, [Validators.required]],
        scorers: this._fb.array([]),
        assists: this._fb.array([]),
        motm: ['', [Validators.required]],
        dotd: ['', [Validators.required]],
      }),
    });
  }

  // #region Generated
  get scorers(): FormArray {
    return this.matchForm.get('osm.scorers') as FormArray;
  }

  get assists(): FormArray {
    return this.matchForm.get('osm.assists') as FormArray;
  }

  addScorer(): void {
    this.scorers.push(this._fb.control(''));
  }

  addAssist(): void {
    this.assists.push(this._fb.control(''));
  }

  onSubmit(): void {
    const player = new Player({
      firstName: 'Max',
      lastName: 'Cobbett',
      position: 'MID',
      squadNumber: 0,
    });

    const matchReport = new MatchReport({
      matchId: 'match-1',
      // opposition: new Opposition({ name: 'Legal Head' }),
      // goals: [
      //   new Goal({ matchId: 'match-1', playerId: 'player-1' }),
      //   new Goal({ matchId: 'match-1', playerId: 'player-1' }),
      //   new Goal({ matchId: 'match-1', playerId: 'player-1' }),
      // ],
      // isHome: true,
      manOfTheMatch: 'player-1',
      dickOfTheDay: 'player-1',
    });

    // removeUndefinedPropertiesRecursive(matchReport);

    // if (this.matchForm.valid) {
    this._matchSvc.saveMatchReport(matchReport);
    // }
  }
  // #endregion Generated
}
