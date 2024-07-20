import { DatePipe } from "@angular/common";
import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-diagnose",
  templateUrl: "./edit-diagnose.component.html",
  styleUrl: "./edit-diagnose.component.scss",
})
export class EditDiagnoseComponent implements OnInit {
  @Input() id: any;
  diagnosesForm: FormGroup;
  loading = false;
  diagnosesList: any;
  selectedFileNationalID: File;
  imageUrlNationalID: any;
  children: any;
  diagnose: any;
  modalRef: any;
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    this.children = JSON.parse(localStorage.getItem("children")!);
    this.diagnose = JSON.parse(localStorage.getItem("oneChild")!);
    this.imageUrlNationalID = this.diagnose?.attachment;
    console.log(this.children);
    this.getDiagnoses();
  }

  ngOnInit(): void {
    console.log(this.id);
    this.getDiagnose();
    this.initForm();
  }

  initForm() {
    this.diagnosesForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      date: [this.diagnose.date],
      institution: [this.diagnose.institution],
      symptoms_age: [this.diagnose.symptoms_age],
      symptoms: [this.diagnose.symptoms],
      diagnose_id: [this.diagnose.diagnose_id],
    });
  }
  get f() {
    return this.diagnosesForm.controls;
  }
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
  }
  getDiagnose() {
    console.log(this.children.id);
    this.apiService
      .getOneChildDiagnoseEdit(this.children.id, this.diagnose.id)
      .subscribe(
        (res) => {
          console.log(res);
          this.diagnose = res;
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error, error.status);
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
  addDiagnose() {
    console.log(this.selectedFileNationalID);
    this.loading = true;
    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    formData.append("institution", this.f.institution.value);
    formData.append("symptoms_age", this.f.symptoms_age.value);
    formData.append("symptoms", this.f.symptoms.value);
    formData.append("diagnose_id", this.f.diagnose_id.value);
    formData.append(
      "date",
      this.datePipe.transform(this.f.date.value, "yyyy-MM-dd")!
    );
    if (this.selectedFileNationalID != null) {
      formData.append("path", this.selectedFileNationalID);
    }

    this.apiService
      .editChildrenDiagnose(formData, this.children.id, this.diagnose.id)
      .subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
          this.toastr.success(
            this.translate.instant("diagnoseEditSuccessfully")
          );
          this.activeModal.close();
          localStorage.removeItem("oneChild");
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.message);
          this.loading = false;
          console.log(error);
          this.cdr.detectChanges();
        }
      );
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteDiagnose() {
    this.loading = true;
    this.apiService
      .deleteChildrenDiagnose(this.children.id, this.diagnose.id)
      .subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
          this.toastr.success(
            this.translate.instant("diagnoseDeleteSuccessfully")
          );
          this.activeModal.close();
          localStorage.removeItem("oneChild");
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.message);
          this.loading = false;
          console.log(error);
          this.cdr.detectChanges();
        }
      );
    this.modalRef.hide();
  }
}
