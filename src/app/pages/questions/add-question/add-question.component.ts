import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-question",
  templateUrl: "./add-question.component.html",
  styleUrl: "./add-question.component.scss",
})
export class AddQuestionComponent implements OnInit {
  questionForm: FormGroup;
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
    this.questionForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      type: [null, [Validators.required]],
      options: this.formBuilder.array(
        [this.newItem(), this.newItem()]
      ),
    });
  }
  get f() {
    return this.questionForm.controls;
  };

  addLevel(options?: any) {
    this.items().push(this.newItem(options));
  }

  newItem(options?: any): FormGroup {
    return this.formBuilder.group({
      options: [options, Validators.required],
    });
  }

  items(): FormArray {
    return this.questionForm.get("options") as FormArray;
  };
  removeLevel(i: number) {
    this.items().removeAt(i);
  };
  addQuestion() {
    const formData = new FormData();
   if (this.f.type.value == 'options') {
     for (let i = 0; i < this.items().length; i++) {
       const option = this.f.options.value[i].options;
       formData.append(`options[${i}]`, option);
     }
   } 
    formData.append('title', this.f.name.value);
    formData.append('type', this.f.type.value);

    this.loading = true;
    console.log(formData);
    this.apiService.addQuestion(formData).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("questionAddedSuccessfully"));
        this.router.navigate(["/apps/questions"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }
}
