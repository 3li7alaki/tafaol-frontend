import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import {ApiService} from "../../../../services/api.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;

  // private fields
  constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private toastr: ToastrService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
    // Get token from URL get params
    this.token = window.location.href.split('token=')[1] ?? '';
    if (this.token === '') {
        this.toastr.error('Invalid reset password link');
      this.router.navigate(['/auth/login'])
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  initForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      password_confirmation: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const passwordConfirmation = formGroup.get('password_confirmation')?.value;

    return password === passwordConfirmation ? null : { passwordsMismatch: true };
  }

  submit() {
    this.apiService.resetPassword(
        this.f.password.value,
        this.f.password_confirmation.value,
        this.token
    ).subscribe(
        () => {
            this.toastr.success('Password reset successfully');
            this.router.navigate(['/auth/login']);
        },
        (error) => {
            this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        }
    );
  }
}
