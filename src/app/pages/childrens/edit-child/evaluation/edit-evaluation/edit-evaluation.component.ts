import { DatePipe, Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-edit-evaluation",
  templateUrl: "./edit-evaluation.component.html",
  styleUrl: "./edit-evaluation.component.scss",
})
export class EditEvaluationComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  formList: any;
  questionList: any;
  program: any;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  evalutation: any;
  loadingDelete = false;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private location: Location
  ) {
    this.program = JSON.parse(localStorage.getItem("program_id")!);
    this.evalutation = JSON.parse(localStorage.getItem("evaluationProgram")!);
  }
  ngOnInit(): void {
    this.getEvalutaions();
    this.initForm();
    this.getQuestions();
    this.evalutation.questions.forEach((element: any) => {
      this.addLevel(element.answer);
    });
    this.selectedFileNationalID = this.evalutation.attachment;
  }
  initForm(): void {
    this.statusForm = this.formBuilder.group({
      form_id: [this.evalutation.form.id, [Validators.required]],
      date_1: [this.evalutation.date_1],
      date_2: [this.evalutation.date_2],
      date_3: [this.evalutation.date_3],
      note: [this.evalutation.note],
      done: [this.evalutation.done],
      pass: [this.evalutation.pass],
      questions: this.formBuilder.array([]),
    });

    const formArray = this.items() as FormArray;
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

  addLevel(questions?: any) {
    this.items().push(this.newItem(questions));
  }

  newItem(questions?: any): FormGroup {
    return this.formBuilder.group({
      question_id: [questions?.question_id, Validators.required],
      note: [questions?.note, Validators.required],
      answer: [questions?.answer, Validators.required],
    });
  }

  items(): FormArray {
    return this.statusForm.get("questions") as FormArray;
  }
  removeLevel(i: number) {
    this.items().removeAt(i);
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
    // formData.append("questions", this.f.questions.value);
    if (this.selectedFileNationalID) {
      formData.append("path", this.selectedFileNationalID);
    }
    this.apiService
      .editChildProgramEvaluation(formData, this.program)
      .subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
          this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.error);
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
  goBackToPrevPage(): void {
    this.location.back();
  }
  deleteDiagnoses(id: any) {
    this.loadingDelete = true;
    this.apiService.deleteChildProgramEvaluation(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("evaluationDeletedSuccessfully")
        );
        this.loadingDelete = false;
        window.location.reload();
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
  hasOptions(index: number): boolean {
    const questionFormGroup = this.items().at(index);
    const selectedQuestionId = questionFormGroup.get("question_id")?.value;
    questionFormGroup.get("question_id")?.disable();
    const selectedQuestion = this.questionList.find(
      (question: any) => question.id === selectedQuestionId
    );
    return selectedQuestion && selectedQuestion.options === null;
  }
  disableAllQuestionIds() {}
}
