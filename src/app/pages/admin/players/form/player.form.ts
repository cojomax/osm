import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from '@nz/button';
import { NzDatePickerModule } from '@nz/date-picker';
import { NzFormModule } from '@nz/form';
import { NzInputModule } from '@nz/input';
import { Position } from '../../../../models/position.enum';
import { FormComponent } from '../../../../components/form/form.component';
import { tap } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';

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
export class PlayerFormComponent extends FormComponent implements OnInit {
  form!: FormGroup;

  protected rowSpan = {
    colOne: 6,
    colTwo: 14,
  };

  protected positionOptions = Object.keys(Position).map((key) => ({
    value: Position[key as keyof typeof Position],
    label: Position[key as keyof typeof Position] === Position.Undefined ? '' : Position[key as keyof typeof Position],
  }));

  @Output() update = new EventEmitter<boolean>();

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this._fb.group({
      id: [void 0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: [void 0],
      squadNumber: [null, [Validators.min(0), Validators.max(99), Validators.pattern(/^\d+$/)]],
      country: ['', Validators.required],
      dob: [null],
      height: [null, [Validators.min(150), Validators.max(244), Validators.pattern(/^\d+$/)]],
    });

    this.form.statusChanges
      .pipe(
        tap(() => {
          this.update.emit(this.form.valid);
        }),
      )
      .subscribe();
  }
}
