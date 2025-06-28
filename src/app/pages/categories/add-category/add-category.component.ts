import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrl: "./add-category.component.scss",
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
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
    this.initForm();
  };

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ["", [Validators.required]],
    });
  }
  get f() {
    return this.categoryForm.controls;
  };

  addCategory() {
    const formData = new FormData();

    formData.append('name', this.f.name.value);

    this.loading = true;

    this.apiService.addCategory(formData).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(this.translate.instant("categoryAddedSuccessfully"));
        this.router.navigate(["/apps/categories"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

        this.cdr.detectChanges();
      }
    );
  }
}
