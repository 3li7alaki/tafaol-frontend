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
  selectedAdmins: [] = [];
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
      users: [null],
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
    this.apiService.getEvaluations().subscribe(
      (res: any) => {

        this.formList = res;
        this.cdr.detectChanges();
      },
      (error: any) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  getQuestions() {
    this.apiService.getQuestions().subscribe(
      (res) => {

        this.questionList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }

  getAdmins() {
    this.apiService.getAdmins().subscribe(
      (res) => {

        this.adminList = res;
        this.cdr.detectChanges();
      },
      (error) => {

        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
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
      this.datePipe.transform(this.f.date_1.value, "yyyy-MM-dd")!
    );
    formData.append(
      "date_2",
      this.datePipe.transform(this.f.date_2.value, "yyyy-MM-dd")!
    );
    formData.append(
        "date_3",
        this.datePipe.transform(this.f.date_3.value, "yyyy-MM-dd")!
    );
    formData.append("done", this.f.done.value == true ? "1" : "0");
    formData.append("pass", this.f.pass.value == true ? "1" : "0");
    for (let i = 0; i < this.selectedAdmins.length; i++) {
      const user = this.selectedAdmins[i];
      formData.append(`users[${i}]`, user);
    }
    if (this.selectedFileNationalID) {
      formData.append("path", this.selectedFileNationalID);
    }
    this.apiService.addChildProgramEvaluation(formData, this.program).subscribe(
      (res) => {
        this.loading = false;

        this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents

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

    if (id) {
      
      const selectedForm = this.formList.find((form: form) => form.id == id);

      if (selectedForm) {
        const questions = selectedForm.questions;
        this.statusForm.setControl("questions", this.formBuilder.array([]));
        questions.forEach((question: any) => {
          this.addQuestion(question);
        });
        this.questionList = selectedForm.questions;
      } else {
        
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
