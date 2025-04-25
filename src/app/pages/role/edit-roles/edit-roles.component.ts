import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { RoleService } from "src/app/services/auth/role.service";
interface Permission {
  id: number;
  title: string;
  title_ar: string;
  name: string;
  group: string;
  // other properties
}

@Component({
  selector: "app-edit-roles",
  templateUrl: "./edit-roles.component.html",
  styleUrl: "./edit-roles.component.scss",
})
export class EditRolesComponent implements OnInit {
  id: any;
  role: any;
  rolesFrom: FormGroup;
  permissionsList: any;
  adminPermission: any[];
  adminSelected: Permission[] = [];
  generalRoles: any[];
  generalSelected: Permission[] = [];
  EvaluationRoles: any[];
  EvaluationSelected: Permission[] = [];
  programsRoles: any[];
  programsSelected: Permission[] = [];
  childrenRoles: any[];
  childrenSelected: Permission[] = [];
  selectedPermissions: Permission[] = [];
  loading = false;
  loadingDelete = false;
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
    private rout: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private apiService: RoleService,
    private modalService: BsModalService
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.role = this.rout.snapshot.data.role;

    this.apiService.getPermissions().subscribe((res) => {
      this.permissionsList = res;
      this.adminPermission = this.permissionsList.Admins;
      this.generalRoles = this.permissionsList.Roles;
      this.EvaluationRoles = this.permissionsList.Evaluation;
      this.programsRoles = this.permissionsList.Programs;
      this.childrenRoles = this.permissionsList.Children;
      

      this.cdr.detectChanges();
    });
  }
  ngOnInit(): void {
    this.initForm();
    this.generalSelected = this.role.permissions
      .filter((permission: Permission) => permission.group === "Roles")
      .map((permission: Permission) => permission.id);
    this.f.generalIDs.setValue(this.generalSelected);
    this.adminSelected = this.role.permissions
      .filter((permission: Permission) => permission.group === "Admins")
      .map((permission: Permission) => permission.id);
    this.f.adminIDs.setValue(this.adminSelected);
    this.EvaluationSelected = this.role.permissions
      .filter((permission: Permission) => permission.group === "Evaluation")
      .map((permission: Permission) => permission.id);
    this.f.evaluationIDs.setValue(this.EvaluationSelected);
    this.programsSelected = this.role.permissions
      .filter((permission: Permission) => permission.group === "Programs")
      .map((permission: Permission) => permission.id);
    this.f.programsIDs.setValue(this.programsSelected);
    this.childrenSelected = this.role.permissions
      .filter((permission: Permission) => permission.group === "Children")
      .map((permission: Permission) => permission.id);
    this.f.childrenIDs.setValue(this.childrenSelected);
  }
  initForm() {
    this.rolesFrom = this.formBuilder.group({
      name: [this.role.name, [Validators.required]],
      generalIDs: [""],
      adminIDs: [""],
      evaluationIDs: [""],
      programsIDs: [""],
      childrenIDs: [""],
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


    this.apiService.editRole(body, this.id).subscribe(
      (res) => {
        this.loading = false;

        
        this.toastr.success("تم تعديل الصلاحية بنجاح");
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
  deleteRoles(id: any) {
    this.loadingDelete = true;
    this.apiService.deleteRole(id).subscribe(
      (res) => {
        this.loadingDelete = false;
        this.toastr.success("تم حذف الصلاحية بنجاح");
        this.router.navigate(["/apps/roles"]);
        this.cdr.detectChanges();
        this.modalRef?.hide();
      },
      (error) => {
        this.loadingDelete = false;
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

        this.cdr.detectChanges();
        this.modalRef?.hide();
      }
    );
  };
  public onSelectAllGeneral() {
    this.rolesFrom
      .get("generalIDs")!
      .patchValue(this.permissionsList.Roles.map((e: any) => e.id));
  }

  public onClearAllGeneral() {
    this.rolesFrom.get("generalIDs")!.patchValue([]);
  }
  public onSelectAllAdmin() {
    this.rolesFrom
      .get("adminIDs")!
      .patchValue(this.permissionsList.Admins.map((e: any) => e.id));
  }

  public onClearAllAdmin() {
    this.rolesFrom.get("adminIDs")!.patchValue([]);
  }
  public onSelectAllEvaluation() {
    this.rolesFrom
      .get("evaluationIDs")!
      .patchValue(this.permissionsList.Evaluation.map((e: any) => e.id));
  }

  public onClearAllEvaluation() {
    this.rolesFrom.get("evaluationIDs")!.patchValue([]);
  }
  public onSelectAllPrograms() {
    this.rolesFrom
      .get("programsIDs")!
      .patchValue(this.permissionsList.Programs.map((e: any) => e.id));
  }

  public onClearAllPrograms() {
    this.rolesFrom.get("programsIDs")!.patchValue([]);
  }
  public onSelectAllChildren() {
    this.rolesFrom
      .get("childrenIDs")!
      .patchValue(this.permissionsList.Children.map((e: any) => e.id));
  }

  public onClearAllChildren() {
    this.rolesFrom.get("childrenIDs")!.patchValue([]);
  };
  openModal(template: TemplateRef<void>, id: any) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }
  decline(): void {
    this.modalRef?.hide();
  }
}
