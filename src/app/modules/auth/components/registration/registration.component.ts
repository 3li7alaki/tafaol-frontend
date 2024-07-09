import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ConfirmPasswordValidator } from "./confirm-password.validator";
import { UserModel } from "../../models/user.model";
import { first } from "rxjs/operators";
import { ApiService } from "src/app/services/api.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private apiService  : ApiService,
    private toastr : ToastrService,
    private translate : TranslateService,
    private cdr : ChangeDetectorRef
  ) {
    // this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        fullname: ["", Validators.compose([Validators.required])],
        phone: ["", Validators.compose([Validators.required])],
        email: [
          "",
          Validators.compose([Validators.required, Validators.email]),
        ],
        password: [
          "",
          Validators.compose([
            Validators.required,
          ]),
        ],
        cPassword: [
          "",
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }
  submit() {
    this.isLoading = true
    const body = {
      name: this.f.fullname.value,
      phone: this.f.phone.value,
      email: this.f.email.value,
      password: this.f.password.value,
      password_confirmation: this.f.cPassword.value,
    };
    console.log(body);
    this.apiService.register(body).subscribe(
      (res) => {
        this.isLoading = false
        console.log(res);
        this.toastr.success("لقد تم إنشاء حسابك");
        this.router.navigate(['/auth/login'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.isLoading = false
        this.toastr.error(error.error)
        console.log(error);
        this.cdr.detectChanges()
      }
    );
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
