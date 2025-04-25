import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-evaluation",
  templateUrl: "./add-evaluation.component.html",
  styleUrl: "./add-evaluation.component.scss",
})
export class AddEvaluationComponent implements OnInit {
  evaluationForm: FormGroup;
  loading = false;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  questionsList: any[];
  EvaluationSelected : [] = [];
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getQuestions();
  }

  initForm() {
    this.evaluationForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      questions : [null]
    });
  }
  get f() {
    return this.evaluationForm.controls;
  }
  addDiagnose() {
    this.loading = true;
   
    const formData = new FormData();

    // Log the FormData object to the console
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    if(this.selectedFileNationalID){
      formData.append("path", this.selectedFileNationalID);
    }
    for (let i = 0; i < this.EvaluationSelected.length; i++) {
      const questions = this.EvaluationSelected[i];
      formData.append(`questions[${i}]`, questions);
    }

    this.apiService.addEvaluation(formData).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success(
          this.translate.instant("evaluationAddedSuccessfully")
        );
        this.router.navigate(["/apps/evaluation"]);
        this.cdr.detectChanges();
      },
      (error: any) => {
        this.toastr.error(error.error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  };
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents
    console.log(file)
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
  getQuestions(){
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
  };
}
