import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from '@nz/form';
import { NzIconModule } from '@nz/icon';
import { NzInputModule } from '@nz/input';
import { NzMessageService } from '@nz/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { catchError, finalize, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormsModule, NzButtonModule, NzFormModule, NzIconModule, NzInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPageComponent implements OnInit {
  protected isSubmitting = false;

  protected loginForm!: FormGroup<any>;

  constructor(
    private authSvc: AuthService,
    private messageSvc: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.authSvc
      .loginWithPassword(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        tap(() => {
          this.showSuccessMsg('Login successful');
          this.router.navigateByUrl('/');
        }),
        catchError((err) => {
          this.showErrorMsg('Login failed');
          return err;
        }),
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe();
  }

  private showSuccessMsg(msg: string) {
    this.messageSvc.success(msg, { nzDuration: 10_000 });
  }

  private showErrorMsg(msg: string) {
    this.messageSvc.error(msg, { nzDuration: 10_000 });
  }
}
