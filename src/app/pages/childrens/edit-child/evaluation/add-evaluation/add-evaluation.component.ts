import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
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
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: "app-add-evaluation",
  templateUrl: "./add-evaluation.component.html",
  styleUrl: "./add-evaluation.component.scss",
})
export class AddEvaluationComponent implements OnInit {
  form: FormGroup;
  loading = false;
  formList: Form[] = [];
  adminList: any[] = [];
  selectedAdmins: number[] = [];
  program: any;
  selectedFile: File | null = null;
  selectedForm: Form | null = null;
  categories: Category[] = [];

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
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
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

  get f() {
    return this.form.controls;
  }

  get questionsArray(): FormArray {
    return this.form.get("questions") as FormArray;
  }

  onFormSelectionChange(event: any): void {
    const formId = parseInt(event.target.value);
    if (formId) {
      this.selectedForm = this.formList.find(form => form.id === formId) || null;
      this.buildQuestionsForm();
      this.extractCategories();
    } else {
      this.selectedForm = null;
      this.resetQuestionsForm();
      this.categories = [];
    }
  }

  private buildQuestionsForm(): void {
    if (!this.selectedForm?.questions) return;

    this.resetQuestionsForm();
    
    this.selectedForm.questions.forEach(question => {
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

  private resetQuestionsForm(): void {
    while (this.questionsArray.length !== 0) {
      this.questionsArray.removeAt(0);
    }
  }

  private extractCategories(): void {
    if (!this.selectedForm?.questions) {
      this.categories = [];
      return;
    }

    const categoryMap = new Map<number, Category>();
    
    this.selectedForm.questions.forEach(question => {
      if (question.category && !categoryMap.has(question.category.id)) {
        categoryMap.set(question.category.id, question.category);
      }
    });

    this.categories = Array.from(categoryMap.values());
  }

  getQuestionsByCategory(categoryId: number): { question: Question; index: number }[] {
    if (!this.selectedForm?.questions) return [];

    return this.selectedForm.questions
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
    }
  }

  addGaurd(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();

    this.apiService.addChildProgramEvaluation(formData, this.program).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success(this.translate.instant("evaluatedSuccessfully"));
        this.activeModal.close(res);
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValues = this.form.getRawValue(); // Get all values including disabled fields

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

    // File attachment
    if (this.selectedFile) {
      formData.append("path", this.selectedFile);
    }

    return formData;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
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

  private handleError(error: any): void {
    const errorMessage = error?.message || error?.error?.message || error?.error || error || 'An error occurred';
    this.toastr.error(errorMessage);
  }
}