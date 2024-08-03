import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

interface form {
  id: any;
}

@Component({
  selector: "app-add-evaluation",
  templateUrl: "./add-evaluation.component.html",
  styleUrl: "./add-evaluation.component.scss",
})
export class AddEvaluationComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  formList: any;
  questionList: any;
  adminList: any;
  program: any;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.program = JSON.parse(localStorage.getItem("program_id")!);
  }
  ngOnInit(): void {
    this.getEvalutaions();
    this.initForm();
    this.getQuestions();
    this.getAdmins();
  }
  initForm() {
    this.statusForm = this.formBuilder.group({
      form_id: [null, [Validators.required]],
      user_id: [null],
      date_1: [""],
      date_2: [""],
      date_3: [""],
      note: [""],
      done: [false],
      pass: [false],
      questions: this.formBuilder.array([]),
    });
    this.items().get('question_id')?.disable()
  }
  get f() {
    return this.statusForm.controls;
  }
  getEvalutaions() {
    this.apiService.getEvalutaions().subscribe(
      (res) => {
        console.log(res);
        this.formList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  getQuestions() {
    this.apiService.getQuestions().subscribe(
      (res) => {
        console.log(res);
        this.questionList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }

  getAdmins() {
    this.apiService.getAdmins().subscribe(
      (res) => {
        console.log(res);
        this.adminList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      });
  }


  items(): FormArray {
    return this.statusForm.get("questions") as FormArray;
  }

  addGaurd() {
    this.loading = true;

    const formData = new FormData();
    const scheduleControls = (this.f.questions as FormArray).controls;
    for (let i = 0; i < scheduleControls.length; i++) {
      formData.append(
        `questions[${i}][question_id]`,
        scheduleControls[i].get("question_id")?.value
      );
      formData.append(
        `questions[${i}][note]`,
        scheduleControls[i].get("note")?.value
      );
      formData.append(
        `questions[${i}][answer]`,
        scheduleControls[i].get("answer")?.value
      );
    }
    // Log the FormData object to the console
    formData.append("form_id", this.f.form_id.value);
    formData.append("note", this.f.note.value);

    formData.append(
      "date_1",
      this.datePipe.transform(
          typeof this.f.date_1.value === 'string'
              ? this.f.date_1.value
              : this.f.date_1.value?.setDate(this.f.date_1.value.getDate() + 1),
            "yyyy-MM-dd"
      )!
    );
    formData.append(
      "date_2",
      this.datePipe.transform(
            typeof this.f.date_2.value === 'string'
                ? this.f.date_2.value
                : this.f.date_2.value?.setDate(this.f.date_2.value.getDate() + 1),
                "yyyy-MM-dd"
        )!
    );
    formData.append(
        "date_3",
        this.datePipe.transform(
                typeof this.f.date_3.value === 'string'
                    ? this.f.date_3.value
                    : this.f.date_3.value?.setDate(this.f.date_3.value.getDate() + 1),
                    "yyyy-MM-dd"
            )!
    );
    formData.append("done", this.f.done.value == true ? "1" : "0");
    formData.append("pass", this.f.pass.value == true ? "1" : "0");
    formData.append("user_id", this.f.user_id.value);
    // formData.append("questions", this.f.questions.value);
    if (this.selectedFileNationalID) {
      formData.append("path", this.selectedFileNationalID);
    }
    this.apiService.addChildProgramEvaluation(formData, this.program).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message);
        this.loading = false;
        console.log(error.message);
        this.cdr.detectChanges();
      }
    );
  }
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents
    console.log(file);
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlNationalID = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  onFormSelectionChange(event: any) {
    const id = event.target.value;
    console.log(id);
    if (id) {
      console.log(this.formList);
      const selectedForm = this.formList.find((form: form) => form.id == id);
      console.log(selectedForm);
      if (selectedForm) {
        const questions = selectedForm.questions;
        this.statusForm.setControl("questions", this.formBuilder.array([]));
        questions.forEach((question: any) => {
          this.addQuestion(question);
        });
      } else {
        console.log("Selected form not found in formList");
      }
    }
  }
  addQuestion(question?: any) {
    this.items().push(this.newQuestion(question));
  }

  newQuestion(question?: any): FormGroup {
    return this.formBuilder.group({
      question_id: [question?.id, Validators.required],
      note: [question?.note, Validators.nullValidator],
      answer: [question?.answer, Validators.required],
    });
  };
  hasOptions(index: number): boolean {
    const questionFormGroup = this.items().at(index);
    questionFormGroup.get("question_id")?.disable();
    const selectedQuestionId = questionFormGroup.get('question_id')?.value;
    const selectedQuestion = this.questionList.find((question: any) => question.id === selectedQuestionId);
    return selectedQuestion && selectedQuestion.options === null;
  }
}
