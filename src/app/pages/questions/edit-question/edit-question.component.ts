import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.scss'
})
export class EditQuestionComponent implements OnInit {
  id: any;
  question: any;
  questionForm: FormGroup;
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
    this.question = this.rout.snapshot.data.questions;
  }
  ngOnInit(): void {
    this.initForm()
    console.log(this.question)
    this.question.options.forEach((element: any) => {
      this.addLevel(element)
    });
  };
  initForm() {
    this.questionForm = this.formBuilder.group({
      name: [this.question.title, [Validators.required]],
      type: [this.question.type, [Validators.required]],
      options: this.formBuilder.array(
        []
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
  editQuestion() {
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
    this.apiService.editQuestions(formData, this.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("questionEditedSuccessfully"));
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
