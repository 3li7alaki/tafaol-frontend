import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

interface forms {
  id: number;
  title: string;
  title_ar: string;
  name: string;
  group: string;
  // other properties
}

@Component({
  selector: "app-edit-evaluation",
  templateUrl: "./edit-evaluation.component.html",
  styleUrl: "./edit-evaluation.component.scss",
})
export class EditEvaluationComponent implements OnInit {
  id: any;
  evaluation: any;
  evaluationForm: FormGroup;
  loading = false;
  selectedFileNationalID: any;
  newFileNationalID: File;
  imageUrlNationalID: string;
  questionsList: forms[] = [];
  EvaluationSelected: [] = [];
  loadingDelete = false;
  constructor(
    private rout: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.id = this.rout.snapshot.params["id"];
    this.evaluation = this.rout.snapshot.data.evaluation;
  }

  ngOnInit(): void {
    this.initForm();
    this.getQuestions();
    console.log(this.evaluation);
    this.selectedFileNationalID = this.evaluation.attachment;
    this.EvaluationSelected = this.evaluation.questions.map((element: forms) => element.id);
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
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    this.newFileNationalID = file;
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
  getQuestions() {
    this.apiService.getQuestions().subscribe(
      (res) => {
        console.log(res);
        this.questionsList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
      }
    );
  }
  addDiagnose() {
    this.loading = true;

    const formData = new FormData();
    console.log(this.selectedFileNationalID)
    console.log(this.imageUrlNationalID)
    // Log the FormData object to the console
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    if(this.newFileNationalID) {
      formData.append("path", this.newFileNationalID);
    }
    for (let i = 0; i < this.EvaluationSelected.length; i++) {
      const file = this.EvaluationSelected[i];
      formData.append(`questions[${i}]`, file);
    }

    this.apiService.editEvalutaions(formData, this.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(
          this.translate.instant("evaluationEditedSuccessfully")
        );
        this.router.navigate(["/apps/evaluation"]);
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  };
  deleteDiagnoses(id: any) {
    this.loadingDelete = true
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
        this.toastr.error(error);
        this.loading = false;
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  protected readonly open = open;
}
