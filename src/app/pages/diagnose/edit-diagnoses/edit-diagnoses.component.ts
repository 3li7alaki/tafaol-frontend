import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-diagnoses',
  templateUrl: './edit-diagnoses.component.html',
  styleUrl: './edit-diagnoses.component.scss'
})
export class EditDiagnosesComponent implements OnInit {
  id: any;
  diagnoses: any;
  diagnosesForm: FormGroup;
  loading = false;
  loadingDelete = false;
  permissionList: any[] = JSON.parse(
    localStorage.getItem("permissions") || "{}"
  );
  showDeleteNationalites = false;
  user = JSON.parse(localStorage.getItem("user") || "{}");
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private rout: ActivatedRoute,
  ){
    this.id = this.rout.snapshot.params["id"];
    this.diagnoses = this.rout.snapshot.data.diagnoses;
  }
  ngOnInit(): void {
    this.initForm();
  };
  initForm() {
    this.diagnosesForm = this.formBuilder.group({
      name: [this.diagnoses.name, [Validators.required]],
      description: [this.diagnoses.description, [Validators.required]],
    });
  }
  get f() {
    return this.diagnosesForm.controls;
  }
  editDiagnose() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      description: this.f.description.value,
    };
    console.log(body);
    this.apiService.editDiagnoses(body, this.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(
          this.translate.instant("diagnoseEditSuccessfully")
        );
        this.router.navigate(["/apps/diagnose"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  };
  deleteDiagnoses(id: any) {
    this.loadingDelete = true
    this.apiService.deleteDiagnoses(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("diagnosesDeletedSuccessfully")
        );
        this.loadingDelete = false;
        this.router.navigate(['/apps/diagnose']);
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingDelete = false;
        this.toastr.error(error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
}
