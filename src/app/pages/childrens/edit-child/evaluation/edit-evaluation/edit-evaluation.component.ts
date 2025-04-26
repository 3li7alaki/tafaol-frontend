import { DatePipe, Location } from "@angular/common";
import { EvaluationPdfExportUtil } from "../../../../../util/evaluation-pdf-export.util";
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

interface form {
  id: any;
}
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
  adminList: any;
  selectedAdmins: [] = [];
  program: any;
  selectedFileNationalID: File;
  newFileNationalID: any;
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
    if (this.evalutation.done) {
        this.statusForm.disable();
    }
    this.getAdmins();
    this.newFileNationalID = false;
    this.selectedAdmins = this.evalutation.users.map((element: any) => element.id);
  }
  initForm(): void {
    this.statusForm = this.formBuilder.group({
      form_id: [this.evalutation.form.id, [Validators.required]],
      users: [null],
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
        });
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

    for (let i = 0; i < this.selectedAdmins.length; i++) {
      const user = this.selectedAdmins[i];
      formData.append(`users[${i}]`, user);
    }
    // formData.append("questions", this.f.questions.value);
    if (this.newFileNationalID) {
      formData.append("path", this.selectedFileNationalID);
    }
    this.apiService
      .editChildProgramEvaluation(formData, this.program)
      .subscribe(
        (res) => {
          this.loading = false;

          this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
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
    this.newFileNationalID = true;
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
          this.addLevel(question);
        });
      } else {
        
      }
    }
  }
  goBackToPrevPage(): void {
    this.location.back();
  }
  deleteEvaluation(id: any) {
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
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;

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

  goToLink(url: any) {
    window.open(url, "_blank");
  }

  exportToPdf() {
    try {
      this.loading = true;
      
      // Make sure questions are loaded
      if (!this.questionList || this.questionList.length === 0) {
        this.toastr.error(this.translate.instant('EXPORT.ERROR'));
        this.loading = false;
        return;
      }
      
      // Prepare evaluation data for PDF
      const evaluationData = {
        formName: this.evalutation.form?.name || '',
        date1: this.datePipe.transform(this.evalutation.date_1, 'yyyy-MM-dd'),
        date2: this.datePipe.transform(this.evalutation.date_2, 'yyyy-MM-dd'),
        date3: this.datePipe.transform(this.evalutation.date_3, 'yyyy-MM-dd'),
        evaluators: this.evalutation.users?.map((user: any) => user.name) || [],
        note: this.evalutation.note || '',
        done: this.evalutation.done,
        pass: this.evalutation.pass,
        questions: this.evalutation.questions.map((q: any) => {
          return {
            title: q.title,
            answer: q.answer.answer,
            note: q.answer.note
          };
        })
      };
      
      // Generate child name for the filename
      const childData = JSON.parse(localStorage.getItem('children') || '{}');
      const childName = childData?.full_name || 'child';
      const fileName = `تقييم ${childName}.pdf`;
      
      // Generate and download the PDF
      EvaluationPdfExportUtil.exportEvaluationToPdf(evaluationData, fileName)
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.toastr.error(this.translate.instant('EXPORT.ERROR'));
        });
    } catch (error) {
      this.loading = false;
      this.toastr.error(this.translate.instant('EXPORT.ERROR'));
    }
  }
}
