import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-nationality",
  templateUrl: "./edit-nationality.component.html",
  styleUrl: "./edit-nationality.component.scss",
})
export class EditNationalityComponent implements OnInit {
  id: any;
  nationality: any;
  nationalityFrom: FormGroup;
  loading = false;
  loadingDelete = false;
  nationalityList: any[];
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showDeleteNationalites = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  modalRef?: BsModalRef;
  deleteID: any;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private rout: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.nationality = this.rout.snapshot.data.nationality;
    if (this.user.type != "super_admin") {
      this.showDeleteNationalites =
        this.permissionList?.includes("delete-nationalities");
    } else {
      this.showDeleteNationalites = true;
    }
  }
  ngOnInit(): void {
    this.initForm();
  };
  
  initForm() {
    this.nationalityFrom = this.formBuilder.group({
      name_ar: [this.nationality.name_ar, [Validators.required]],
      name: [this.nationality.name, [Validators.required]],
    });
  }
  get f() {
    return this.nationalityFrom.controls;
  };
  editNationality() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      name_ar: this.f.name_ar.value,
    };

    this.apiService.editNationality(body, this.nationality.id).subscribe(
      (res) => {
        this.loading = false

        this.toastr.success(this.translate.instant('nationalityEditedSuccessfully'));
        this.router.navigate(['/apps/nationality'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error)
        this.loading = false

        this.cdr.detectChanges()
      }
    );
  };
  deleteNationality(id: any) {
    this.loadingDelete = true;
    this.apiService.deleteNationality(id).subscribe(
      (res) => {
        this.loadingDelete = false;
        this.toastr.success(this.translate.instant('NationalityDeletedSuccessfully'));
        this.router.navigate(['/apps/nationality']);
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
  openModal(template: TemplateRef<void>, id: any) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }
  decline(): void {
    this.modalRef?.hide();
  }
}
