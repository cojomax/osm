import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';
import { FirebaseAuthService } from '../../firebase/services/firebase.auth.service';

@Component({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './register.page.html',
    styleUrl: './register.page.css'
})
export class RegisterPageComponent {
  protected registerForm!: FormGroup<any>;

  protected get email() {
    return this.registerForm.get('email');
  }

  protected get password() {
    return this.registerForm.get('password');
  }

  protected get passwordConfirm() {
    return this.registerForm.get('passwordConfirm');
  }

  protected get isEmailInvalid() {
    return this.email?.dirty && this.email.invalid;
  }

  protected get isPasswordInvalid() {
    return this.password?.dirty && this.password.invalid;
  }

  protected get isPasswordMismatch() {
    return (
      !this.isPasswordInvalid &&
      this.passwordConfirm?.dirty &&
      this.passwordConfirm.value &&
      this.passwordConfirm.value !== this.password?.value
    );
  }

  constructor(private _auth: FirebaseAuthService) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(20),
        ]),
        passwordConfirm: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  protected onSubmit() {
    this._auth
      .createUserEmailPassword(
        this.registerForm.value.email,
        this.registerForm.value.password,
      )
      .pipe(
        tap(() => {
          this.registerForm.reset();
        }),
      )
      .subscribe();
  }

  private passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    return password?.value !== passwordConfirm?.value
      ? { passwordMismatch: true }
      : null;
  };
}
