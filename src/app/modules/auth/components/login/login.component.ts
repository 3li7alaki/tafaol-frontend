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
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  permissionList: String[] = [];
  user: UserModel;
  loading = false;
  // private fields
  private unsubscribe: Subscription[] = [];

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
          Validators.maxLength(320),
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
        this.cdr.detectChanges();
      }
    );
  }

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
