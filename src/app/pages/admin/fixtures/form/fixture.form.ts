import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { NzSelectModule } from '@nz/select';
import { NzTimePickerComponent } from '@nz/time-picker';
import { Subscription, tap } from 'rxjs';
import { FormComponent } from '../../../../components/form/form.component';
import { NzDatePickerModule } from '@nz/date-picker';

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
  // Must be provided to work in the form modal component.
  providers: [{ provide: FormComponent, useExisting: FixtureFormComponent }],
})
export class FixtureFormComponent extends FormComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  private subs = new Subscription();

  /** Emitted when the form status changes. */
  @Output() statusChanged = new EventEmitter<boolean>();

  constructor(private _fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this._fb.group({
      id: [void 0],
      date: [null, Validators.required],
      time: [null],
      venue: ['', Validators.required],
      competition: ['', Validators.required],
      opponent: ['', Validators.required],

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
}
