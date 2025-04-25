import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-edit-attachments',
  templateUrl: './edit-attachments.component.html',
  styleUrl: './edit-attachments.component.scss'
})
export class EditAttachmentsComponent implements OnInit {
  attachmentForm: FormGroup;
  loading = false;
  selectedFile: File;
  imageUrl: string;
  attachment: any;
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
    this.attachment = JSON.parse(localStorage.getItem("oneAttachment")!);
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.attachmentForm = this.formBuilder.group({
      name: [this.attachment.name, [Validators.required]],
      description: [this.attachment.description, [Validators.required]],
    });
  }
  get f() {
    return this.attachmentForm.controls;
  }

  onFileSelected(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFile = file;
    // Create a FileReader object to read the file contents
    const reader = new FileReader();

    // Set the onload event handler of the reader
    reader.onload = (e: ProgressEvent) => {
      // Set the data URL of the image
      this.imageUrl = (<FileReader>e.target).result as string;
      this.cdr.detectChanges();
    };

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
  removeAttachment(i: number) {
    const control = this.attachmentForm.controls.attachments as FormArray;
    control.removeAt(i);
  }
  addGaurd() {
    this.loading = true;
    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    if (this.selectedFile) {
      formData.append("path", this.selectedFile);
    }

    this.apiService.editAttachment(formData, this.attachment.id).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success(this.translate.instant("attachmentEditSuccessfully"));
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
}
