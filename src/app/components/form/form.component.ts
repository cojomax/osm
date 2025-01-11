import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

export abstract class FormComponent {
  public abstract form: FormGroup<any>;
  protected abstract update: EventEmitter<boolean>;
}
