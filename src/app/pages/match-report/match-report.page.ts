import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Goal } from '../../models/goal.model';
import { MatchReport } from '../../models/match-report.model';
import { Match } from '../../models/match.model';
import { Opposition } from '../../models/opposition.model';
import { Player } from '../../models/player.model';
import { MatchService } from '../../services/domain/match.service';

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
      match: new Match({ date: new Date(), venue: 'Happy Valley' }),
      opposition: new Opposition({ name: 'Legal Head' }),
      goals: [
        new Goal({ scorer: player }),
        new Goal({ scorer: player }),
        new Goal({ scorer: player }),
      ],
      isHome: true,
      manOfTheMatch: player,
      dickOfTheDay: player,
    });

    // removeUndefinedPropertiesRecursive(matchReport);

    // if (this.matchForm.valid) {
    this._matchSvc.saveMatchReport({
      match: {
        date: new Date(),
        venue: 'Happy Valley',
        opposition: 'Legal Head',
      } as any,
    } as any);
    // }
  }
  // #endregion Generated
}
