import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-nationality",
  templateUrl: "./add-nationality.component.html",
  styleUrl: "./add-nationality.component.scss",
})
export class AddNationalityComponent implements OnInit {
  nationalityFrom: FormGroup;
  loading = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router
  ) {}
  ngOnInit(): void {
    this.initForm()
  }


  initForm() {
    this.nationalityFrom = this.formBuilder.group({
      name_ar: ["", [Validators.required]],
      name: ["", [Validators.required]],
    });
  }
  get f() {
    return this.nationalityFrom.controls;
  };
  addNationality() {
    this.loading = true;
    const body = {
      name: this.f.name.value,
      name_ar: this.f.name_ar.value,
    };

    this.apiService.addNationality(body).subscribe(
      (res) => {
        this.loading = false

        this.toastr.success(this.translate.instant('nationalityAddedSuccessfully'));
        this.router.navigate(['/apps/nationality'])
        this.cdr.detectChanges()
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error)
        this.loading = false
        this.cdr.detectChanges()
      }
    );
  }
}
