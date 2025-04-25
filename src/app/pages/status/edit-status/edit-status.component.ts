import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-status",
  templateUrl: "./edit-status.component.html",
  styleUrl: "./edit-status.component.scss",
})
export class EditStatusComponent implements OnInit {
  id: any;
  status: any;
  statusForm: FormGroup;
  loading = false;
  loadingDelete = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private translate: TranslateService,
    private rout: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.status = this.rout.snapshot.data.status;
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.statusForm = this.formBuilder.group({
      name_ar: [this.status.name_ar, [Validators.required]],
      name: [this.status.name, [Validators.required]],
    });
  }
  get f() {
    return this.statusForm.controls;
  }
  editNationality() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      name_ar: this.f.name_ar.value,
    };

    this.apiService.editStatus(body, this.status.id).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(
          this.translate.instant("statusEditedSuccessfully")
        );
        this.router.navigate(["/apps/status"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

        this.cdr.detectChanges();
      }
    );
  }
  deleteNationality(id: any) {
    this.loadingDelete = true;
    this.apiService.deleteStatus(id).subscribe(
      (res) => {
        this.loadingDelete = false;
        this.toastr.success(
          this.translate.instant("statusDeletedSuccessfully")
        );
        this.router.navigate(["/apps/status"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingDelete = false;
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

        this.cdr.detectChanges();
      }
    );
  }
}
