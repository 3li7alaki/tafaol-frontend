import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { first } from "rxjs/operators";
import { UserModel } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: "admin@tafaol.com",
    password: "Tafaol@admin56",
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  permissionList: String[] = [];
  user: UserModel;
  loading = false;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (localStorage.getItem("user")) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl".toString()] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.loading = true;
    this.hasError = false;
    this.apiService.doLogin(this.f.email.value, this.f.password.value).then(
      (res) => {
        this.setUserInStorage(res);
        console.log(res);
        this.router.navigate([this.returnUrl]);
        this.translate.setDefaultLang("ar");
        localStorage.setItem("language", "ar");
       
          if (res.type != 'super_admin') {
            res.role.permissions.forEach((per : any) => {
                this.permissionList.push(per.name);
            });
        
        localStorage.setItem(
            "permissions",
            JSON.stringify(this.permissionList)
        );
          } 
        window.location.reload();
        this.cdr.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.hasError = true;
        console.log(err);
        // this.toastr.error(err);
        this.cdr.detectChanges();
      }
    );
  }

  // submit() {
  //   this.hasError = false;
  //   const loginSubscr = this.authService
  //     .login(this.f.email.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe((user: UserModel | undefined) => {
  //       if (user) {
  //         this.router.navigate([this.returnUrl]);
  //       } else {
  //         this.hasError = true;
  //         console.log(this.hasError)
  //       }
  //     });
  //   this.unsubscribe.push(loginSubscr);
  // }
  setUserInStorage(res: any) {
    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    } else {
      localStorage.setItem("user", JSON.stringify(res));
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
