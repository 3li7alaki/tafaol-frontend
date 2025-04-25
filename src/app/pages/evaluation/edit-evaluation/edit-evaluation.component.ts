import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

interface Question {
  id: number;
  title: string;
  title_ar: string;
  name: string;
  group: string;
}

@Component({
  selector: "app-edit-evaluation",
  templateUrl: "./edit-evaluation.component.html",
  styleUrl: "./edit-evaluation.component.scss",
})
export class EditEvaluationComponent implements OnInit {
  id: string;
  evaluation: any;
  evaluationForm: FormGroup;
  loading = false;
  selectedAttachmentFile: any;
  newAttachmentFile: File;
  imageUrlAttachment: string;
  questionsList: Question[] = [];
  selectedQuestions: number[] = [];
  loadingDelete = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.id = this.route.snapshot.params["id"];
    this.evaluation = this.route.snapshot.data.evaluation;
  }

  ngOnInit(): void {
    this.initForm();
    this.getQuestions();
    this.selectedAttachmentFile = this.evaluation.attachment;
    this.selectedQuestions = this.evaluation.questions.map((element: Question) => element.id);
  }
  initForm() {
    this.evaluationForm = this.formBuilder.group({
      name: [this.evaluation.name, [Validators.required]],
      description: [this.evaluation.description, [Validators.required]],
      questions: [null],
    });
  }
  get f() {
    return this.evaluationForm.controls;
  }
  onAttachmentFileSelected(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedAttachmentFile = file;
    this.newAttachmentFile = file;
    // Create a FileReader object to read the file contents

    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrlAttachment = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  getQuestions() {
    this.apiService.getQuestions().subscribe(
      (res) => {
        this.questionsList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }
  saveEvaluation() {
    this.loading = true;

    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    
    if(this.newAttachmentFile) {
      formData.append("path", this.newAttachmentFile);
    }
    
    for (let i = 0; i < this.selectedQuestions.length; i++) {
      const questionId = this.selectedQuestions[i];
      formData.append(`questions[${i}]`, questionId.toString());
    }

    this.apiService.editEvaluation(formData, this.id).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success(
          this.translate.instant("evaluationEditedSuccessfully")
        );
        this.router.navigate(["/apps/evaluation"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
  deleteEvaluation(id: string) {
    this.loadingDelete = true;
    this.apiService.deleteEvaluation(id).subscribe(
      (res) => {
        this.toastr.success(
          this.translate.instant("evaluationDeletedSuccessfully")
        );
        this.loadingDelete = false;
        this.router.navigate(['/apps/evaluation']);
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingDelete = false;
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.cdr.detectChanges();
      }
    );
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  protected readonly open = open;
}
