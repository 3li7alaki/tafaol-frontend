import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  id: any;
  category: any;
  categoryForm: FormGroup;
  loading = false;
  
  constructor(
    private rout: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr : ChangeDetectorRef,
    private toastr : ToastrService,
    private translate : TranslateService,
    private router  :Router
  ){
    this.id = this.rout.snapshot.params["id"];
    this.category = this.rout.snapshot.data.category;
  }
  ngOnInit(): void {
    this.initForm()
  };
  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: [this.category.name, [Validators.required]],
    });
  }
  get f() {
    return this.categoryForm.controls;
  };
  editCategory() {
    const formData = new FormData();
    formData.append('name', this.f.name.value);

    this.loading = true;

    this.apiService.editCategory(formData, this.id).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(this.translate.instant("categoryEditedSuccessfully"));
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
