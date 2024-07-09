import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { RoleService } from "src/app/_fake/services/role.service";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-admin",
  templateUrl: "./edit-admin.component.html",
  styleUrl: "./edit-admin.component.scss",
})
export class EditAdminComponent implements OnInit {
  id : any;
  admin : any;
  adminFrom: FormGroup;
  loading = false;
  eye = false;
  role$ : any[]
  constructor(
    private rout: ActivatedRoute,  
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router,
    private rolesService : RoleService
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.admin = this.rout.snapshot.data.admin;
  }
  ngOnInit(): void {
    this.initForm();
    this.rolesService.getRoles().subscribe((res) => {
      this.role$ = res;
      console.log(res);
      this.cdr.detectChanges();
    });
    console.log(this.admin)
  };
  initForm() {
    this.adminFrom = this.formBuilder.group({
      name: [this.admin.name, [Validators.required]],
      email: [this.admin.email, [Validators.required, Validators.email]],
      phone: [this.admin.phone, [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password_confirmation: ["", [Validators.required, Validators.minLength(8)]],
      role_id: [this.admin.role_id, [Validators.required]],
    });
  }
  get f() {
    return this.adminFrom.controls;
  };
  editAdmin() {
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
    this.apiService.editAdmin(body, this.id).subscribe(
      (res) => {
        this.loading = false
        console.log(res);
        this.toastr.success(this.translate.instant('adminEditedSuccessfully'));
        this.router.navigate(['/apps/admin'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error.message)
        console.log(error.message);
        this.loading = false
        this.cdr.detectChanges()
      }
    );
  };
  togglePassword() {
    this.eye = !this.eye;
  }
}