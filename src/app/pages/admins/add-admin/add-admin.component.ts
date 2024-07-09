import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { RoleService } from "src/app/_fake/services/role.service";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-admin",
  templateUrl: "./add-admin.component.html",
  styleUrl: "./add-admin.component.scss",
})
export class AddAdminComponent implements OnInit {
  adminFrom: FormGroup;
  loading = false;
  eye = false;
  role$ : any[]
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router,
    private rolesService : RoleService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.rolesService.getRoles().subscribe((res) => {
      this.role$ = res;
      console.log(res);
      this.cdr.detectChanges()
    });
  }

  initForm() {
    this.adminFrom = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password_confirmation: ["", [Validators.required, Validators.minLength(8)]],
      role_id: [null, [Validators.required]],
    });
  }
  get f() {
    return this.adminFrom.controls;
  };
  addAdmin() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      email: this.f.email.value,
      phone: this.f.phone.value,
      password: this.f.password.value,
      password_confirmation: this.f.password_confirmation.value,
      role_id: this.f.role_id.value,
    };
    console.log(body);
    this.apiService.addAdmin(body).subscribe(
      (res) => {
        this.loading = false
        console.log(res);
        this.toastr.success(this.translate.instant('adminAddedSuccessfully'));
        this.router.navigate(['/apps/admin'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error.error)
        this.loading = false
        console.log(error);
        this.cdr.detectChanges()
      }
    );
  };
  togglePassword() {
    this.eye = !this.eye;
  }
}
