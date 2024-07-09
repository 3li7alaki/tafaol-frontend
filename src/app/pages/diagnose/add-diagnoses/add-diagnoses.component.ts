import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-diagnoses",
  templateUrl: "./add-diagnoses.component.html",
  styleUrl: "./add-diagnoses.component.scss",
})
export class AddDiagnosesComponent implements OnInit {
  diagnosesForm: FormGroup;
  loading = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.diagnosesForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
  }
  get f() {
    return this.diagnosesForm.controls;
  }
  addDiagnose() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      description: this.f.description.value,
    };
    console.log(body);
    this.apiService.addDiagnoses(body).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(
          this.translate.instant("diagnoseAddedSuccessfully")
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
  }
}
