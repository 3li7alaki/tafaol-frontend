import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { RoleService } from "src/app/services/auth/role.service";

@Component({
  selector: "app-add-roles",
  templateUrl: "./add-roles.component.html",
  styleUrl: "./add-roles.component.scss",
})
export class AddRolesComponent implements OnInit {
  rolesFrom: FormGroup;
  permissionsList: any;
  adminPermission: any[];
  adminSelected = [];
  generalRoles: any[];
  generalSelected = [];
  EvaluationRoles: any[];
  EvaluationSelected = [];
  programsRoles: any[];
  programsSelected = [];
  childrenRoles: any[];
  childrenSelected = [];
  selectedPermissions = [];
  loading = false;
  constructor(
    private apiService: RoleService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.getPermissions().subscribe((res) => {
      this.permissionsList = res;
      this.adminPermission = this.permissionsList.Admins;
      this.generalRoles = this.permissionsList.Roles;
      this.EvaluationRoles = this.permissionsList.Evaluation;
      this.programsRoles = this.permissionsList.Programs;
      this.childrenRoles = this.permissionsList.Children;
      

    });
    this.initForm();
  }

  initForm() {
    this.rolesFrom = this.formBuilder.group({
      name: ["", [Validators.required]],
      studentsIDs: [""],
      generalRoles: [""],
      adminPermission: [""],
      EvaluationRoles: [""],
      programsRoles: [""],
      childrenRoles: [""],
    });
  }
  get f() {
    return this.rolesFrom.controls;
  }
  addRoles() {
    this.loading = true;
    this.selectedPermissions.push(
      ...this.EvaluationSelected,
      ...this.generalSelected,
      ...this.adminSelected,
      ...this.childrenSelected,
      ...this.programsSelected
    );
    const body = {
      name: this.f.name.value,
      permissions: this.selectedPermissions,
    };

    this.apiService.addRole(body).subscribe(
      (res) => {
        this.loading = false;

        
        this.toastr.success("تم إضافة الصلاحية بنجاح");
        this.router.navigate(["/apps/roles"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

        this.cdr.detectChanges();
      }
    );
  }
  public onSelectAllGeneral() {
    this.rolesFrom
      .get("generalRoles")!
      .patchValue(this.permissionsList.Roles.map((e: any) => e.id));
  }

  public onClearAllGeneral() {
    this.rolesFrom.get("generalRoles")!.patchValue([]);
  }
  public onSelectAllAdmin() {
    this.rolesFrom
      .get("adminPermission")!
      .patchValue(this.permissionsList.Admins.map((e: any) => e.id));
  }

  public onClearAllAdmin() {
    this.rolesFrom.get("adminPermission")!.patchValue([]);
  }
  public onSelectAllEvaluation() {
    this.rolesFrom
      .get("EvaluationRoles")!
      .patchValue(this.permissionsList.Evaluation.map((e: any) => e.id));
  }

  public onClearAllEvaluation() {
    this.rolesFrom.get("EvaluationRoles")!.patchValue([]);
  }
  public onSelectAllPrograms() {
    this.rolesFrom
      .get("programsRoles")!
      .patchValue(this.permissionsList.Programs.map((e: any) => e.id));
  }

  public onClearAllPrograms() {
    this.rolesFrom.get("programsRoles")!.patchValue([]);
  }
  public onSelectAllChildren() {
    this.rolesFrom
      .get("childrenRoles")!
      .patchValue(this.permissionsList.Children.map((e: any) => e.id));
  }

  public onClearAllChildren() {
    this.rolesFrom.get("childrenRoles")!.patchValue([]);
  }
}
