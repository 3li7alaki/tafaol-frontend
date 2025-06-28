import { DatePipe, Location } from "@angular/common";
import { EvaluationPdfExportUtil } from "../../../../../util/evaluation-pdf-export.util";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

interface Form {
  id: number;
  name: string;
  questions: Question[];
}

interface Question {
  id: number;
  title: string;
  type: string;
  options: string[] | null;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  answer?: {
    answer: string;
    note: string;
  }
}

interface Category {
  id: number;
  name: string;
}

interface EvaluationAnswer {
  question_id: number;
  answer: string;
  note: string;
}

interface Evaluation {
  id: number;
  form: Form;
  date_1: string;
  date_2: string;
  date_3: string;
  note: string;
  done: boolean;
  pass: boolean;
  questions: any[];
  users: any[];
  attachment: any;
}

@Component({
  selector: "app-edit-evaluation",
  templateUrl: "./edit-evaluation.component.html",
  styleUrl: "./edit-evaluation.component.scss",
})
export class EditEvaluationComponent implements OnInit {
  statusForm: FormGroup;
  loading = false;
  loadingDelete = false;
  formList: Form[] = [];
  adminList: any[] = [];
  selectedAdmins: number[] = [];
  program: any;
  selectedFile: File | any = null;
  fileChanged: boolean = false;
  evaluation: Evaluation;
  categories: Category[] = [];

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
    this.evaluation = JSON.parse(localStorage.getItem("evaluationProgram")!);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.populateFormWithEvaluationData();
  }

  private initForm(): void {
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
  }

  private async loadData(): Promise<void> {
    try {
      await Promise.all([
        this.loadForms(),
        this.loadAdmins()
      ]);
    } catch (error) {
      this.handleError(error);
    }
  }

  private loadForms(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getEvaluations().subscribe({
        next: (res: Form[]) => {
          this.formList = res;
          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          this.handleError(error);
          reject(error);
        }
      });
    });
  }

  private loadAdmins(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getAdmins().subscribe({
        next: (res) => {
          this.adminList = res;
          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          this.handleError(error);
          reject(error);
        }
      });
    });
  }

  private populateFormWithEvaluationData(): void {
    // Set basic form values
    this.statusForm.patchValue({
      form_id: this.evaluation.form.id,
      date_1: this.evaluation.date_1 ? new Date(this.evaluation.date_1) : null,
      date_2: this.evaluation.date_2 ? new Date(this.evaluation.date_2) : null,
      date_3: this.evaluation.date_3 ? new Date(this.evaluation.date_3) : null,
      note: this.evaluation.note,
      done: this.evaluation.done,
      pass: this.evaluation.pass,
    });

    // Set selected admins
    this.selectedAdmins = this.evaluation.users.map(user => user.id);

    // Set attachment
    this.selectedFile = this.evaluation.attachment;
    this.fileChanged = false;

    // Build questions form based on the evaluation's form
    this.buildQuestionsFormWithAnswers();
    this.extractCategories();

    // Disable form if evaluation is done
    if (this.evaluation.done) {
      this.statusForm.disable();
    }
  }

  private buildQuestionsFormWithAnswers(): void {
    if (!this.evaluation.questions) return;

    this.resetQuestionsForm();
    
    this.evaluation.questions.forEach(question => {
      const questionGroup = this.createQuestionFormGroupWithAnswer(question);
      this.questionsArray.push(questionGroup);
    });
  }

  private createQuestionFormGroupWithAnswer(question: Question): FormGroup {
    return this.formBuilder.group({
      question_id: [{ value: question.id, disabled: true }, Validators.required],
      note: [question.answer?.note || ""],
      answer: [question.answer?.answer || "", Validators.required],
    });
  }

  private resetQuestionsForm(): void {
    while (this.questionsArray.length !== 0) {
      this.questionsArray.removeAt(0);
    }
  }

  private extractCategories(): void {
    console.log(this.evaluation.questions)
    if (!this.evaluation.questions) {
      this.categories = [];
      return;
    }

    const categoryMap = new Map<number, Category>();
    
    this.evaluation.questions.forEach(question => {
      if (question.category && !categoryMap.has(question.category.id)) {
        categoryMap.set(question.category.id, question.category);
      }
    });

    this.categories = Array.from(categoryMap.values());
  }

  get f() {
    return this.statusForm.controls;
  }

  get questionsArray(): FormArray {
    return this.statusForm.get("questions") as FormArray;
  }

  onFormSelectionChange(event: any): void {
    const formId = parseInt(event.target.value);
    
    if (formId) {
      const selectedForm = this.formList.find(form => form.id === formId);
      if (selectedForm) {
        this.buildQuestionsFormFromForm(selectedForm);
        this.extractCategoriesFromForm(selectedForm);
      }
    } else {
      this.resetQuestionsForm();
      this.categories = [];
    }
  }

  private buildQuestionsFormFromForm(form: Form): void {
    this.resetQuestionsForm();
    
    form.questions.forEach(question => {
      const questionGroup = this.createQuestionFormGroup(question);
      this.questionsArray.push(questionGroup);
    });
  }

  private createQuestionFormGroup(question: Question): FormGroup {
    return this.formBuilder.group({
      question_id: [{ value: question.id, disabled: true }, Validators.required],
      note: [""],
      answer: ["", Validators.required],
    });
  }

  private extractCategoriesFromForm(form: Form): void {
    const categoryMap = new Map<number, Category>();
    
    form.questions.forEach(question => {
      if (question.category && !categoryMap.has(question.category.id)) {
        categoryMap.set(question.category.id, question.category);
      }
    });

    this.categories = Array.from(categoryMap.values());
  }

  getQuestionsByCategory(categoryId: number): { question: Question; index: number }[] {
    if (!this.evaluation.questions) return [];

    return this.evaluation.questions
      .map((question, index) => ({ question, index }))
      .filter(item => item.question.category?.id === categoryId);
  }

  hasOptions(question: Question): boolean {
    return question.options === null;
  }

  getQuestionOptions(question: Question): string[] {
    return question.options || [];
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileChanged = true;
    }
  }

  addGaurd(): void {
    if (this.statusForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();

    this.apiService.editChildProgramEvaluation(formData, this.program).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
        // Optionally refresh the data or navigate
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValues = this.statusForm.getRawValue(); // Get all values including disabled fields

    // Basic form data
    formData.append("form_id", formValues.form_id);
    formData.append("note", formValues.note || "");
    formData.append("done", formValues.done ? "1" : "0");
    formData.append("pass", formValues.pass ? "1" : "0");

    // Dates
    if (formValues.date_1) {
      formData.append("date_1", this.datePipe.transform(formValues.date_1, "yyyy-MM-dd")!);
    }
    if (formValues.date_2) {
      formData.append("date_2", this.datePipe.transform(formValues.date_2, "yyyy-MM-dd")!);
    }
    if (formValues.date_3) {
      formData.append("date_3", this.datePipe.transform(formValues.date_3, "yyyy-MM-dd")!);
    }

    // Users
    this.selectedAdmins.forEach((userId, index) => {
      formData.append(`users[${index}]`, userId.toString());
    });

    // Questions
    formValues.questions.forEach((question: any, index: number) => {
      formData.append(`questions[${index}][question_id]`, question.question_id);
      formData.append(`questions[${index}][note]`, question.note || "");
      formData.append(`questions[${index}][answer]`, question.answer || "");
    });

    // File attachment (only if changed)
    if (this.fileChanged && this.selectedFile) {
      formData.append("path", this.selectedFile);
    }

    return formData;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.statusForm.controls).forEach(key => {
      const control = this.statusForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(formGroup => {
          Object.keys((formGroup as FormGroup).controls).forEach(nestedKey => {
            (formGroup as FormGroup).get(nestedKey)?.markAsTouched();
          });
        });
      }
    });
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  deleteEvaluation(id: any): void {
    this.loadingDelete = true;
    
    this.apiService.deleteChildProgramEvaluation(id).subscribe({
      next: (res) => {
        this.toastr.success(this.translate.instant("evaluationDeletedSuccessfully"));
        this.loadingDelete = false;
        window.location.reload();
      },
      error: (error) => {
        this.loadingDelete = false;
        this.handleError(error);
      }
    });
  }

  goToLink(url: any): void {
    window.open(url, "_blank");
  }

  exportToPdf(): void {
    try {
      this.loading = true;
      
      // Prepare evaluation data for PDF
      const evaluationData = {
        formName: this.evaluation.form?.name || '',
        date1: this.datePipe.transform(this.evaluation.date_1, 'yyyy-MM-dd'),
        date2: this.datePipe.transform(this.evaluation.date_2, 'yyyy-MM-dd'),
        date3: this.datePipe.transform(this.evaluation.date_3, 'yyyy-MM-dd'),
        evaluators: this.evaluation.users?.map((user: any) => user.name) || [],
        note: this.evaluation.note || '',
        done: this.evaluation.done,
        pass: this.evaluation.pass,
        questions: this.evaluation.questions.map((q: any) => {
          return {
            title: q.title,
            answer: q.answer.answer,
            note: q.answer.note,
            category: q.category.name
          };
        })
      };
      
      // Generate child name for the filename
      const childData = JSON.parse(localStorage.getItem('children') || '{}');
      const childName = childData?.full_name || 'child';
      const fileName = `تقييم ${childName}.pdf`;
      
      // Generate and download the PDF
      EvaluationPdfExportUtil.exportEvaluationToPdf(evaluationData, fileName);
    } catch (error) {
      this.toastr.error(this.translate.instant('EXPORT.ERROR'));
    }
    this.loading = false;
  }

  private handleError(error: any): void {
    const errorMessage = error?.message || error?.error?.message || error?.error || error || 'An error occurred';
    this.toastr.error(errorMessage);
  }
}