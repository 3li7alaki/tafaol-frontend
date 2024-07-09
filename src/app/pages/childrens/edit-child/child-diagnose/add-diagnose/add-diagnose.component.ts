import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-diagnose",
  templateUrl: "./add-diagnose.component.html",
  styleUrl: "./add-diagnose.component.scss",
})
export class AddDiagnoseComponent implements OnInit {
  diagnosesForm: FormGroup;
  loading = false;
  diagnosesList : any;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  children: any;
  selectORWrite = false;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe : DatePipe
  ) {
    this.children = JSON.parse(localStorage.getItem("children")!);
  }
  

  ngOnInit(): void {
    this.initForm();
    this.getDiagnoses();
  };

  initForm() {
    this.diagnosesForm = this.formBuilder.group({
      name: [""],
      description: [""],
      date: [""],
      institution: [""],
      symptoms_age : [''],
      symptoms : [''],
      diagnose_id: [null],
    });
  }
  get f() {
    return this.diagnosesForm.controls;
  };
  getDiagnoses() {
    this.apiService.getDiagnoses().subscribe(
      (res) => {
        console.log(res);
        this.diagnosesList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message, error.status);
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
  addDiagnose() {
    this.loading = true;
    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    formData.append("institution", this.f.institution.value);
    formData.append("symptoms_age", this.f.symptoms_age.value);
    formData.append("symptoms", this.f.symptoms.value);
    formData.append("diagnose_id", this.f.diagnose_id.value);
    formData.append("date", this.datePipe.transform(this.f.date.value, 'yyyy-MM-dd')!);
    formData.append("path", this.selectedFileNationalID);
    
    this.apiService.addChildrenDiagnose(formData, this.children.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(
          this.translate.instant("diagnoseAddedSuccessfully")
        );
        this.activeModal.close();
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
  changeSelect() {
    this.selectORWrite = !this.selectORWrite
  }
}
