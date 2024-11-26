import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatchReport } from '../../models/match-report.model';
import { Player } from '../../models/player.model';
import { MatchService } from '../../services/match.service';
import { Position } from '../../models/position.enum';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './match-report.page.html',
  styleUrl: './match-report.page.css',
})
export class MatchReportPageComponent implements OnInit {
  protected matchForm!: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private matchSvc: MatchService,
  ) {}

  ngOnInit() {
    this.matchForm = this.fb.group({
      matchDetails: this.fb.group({
        date: [null, [Validators.required]],
        kickoff: ['', [Validators.required]],
        location: ['', [Validators.required]],
      }),
      opposition: this.fb.group({
        name: ['', [Validators.required]],
        goals: [0, [Validators.required]],
      }),
      osm: this.fb.group({
        kit: this.fb.control<'Home' | 'Away' | null>(null, [
          Validators.required,
        ]),
        goals: [0, [Validators.required]],
        scorers: this.fb.array([]),
        assists: this.fb.array([]),
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
    this.scorers.push(this.fb.control(''));
  }

  addAssist(): void {
    this.assists.push(this.fb.control(''));
  }

  onSubmit(): void {
    const player = new Player({
      firstName: 'Max',
      lastName: 'Cobbett',
      position: Position.midfielder,
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
    this.matchSvc.saveMatchReport(matchReport);
    // }
  }

  // #endregion Generated
}
