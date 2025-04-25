
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-add-attachments',
  templateUrl: './add-attachments.component.html',
  styleUrl: './add-attachments.component.scss'
})
export class AddAttachmentsComponent implements OnInit {
  attachmentForm: FormGroup;
  loading = false;
  selectedFile: File;
  imageUrl: string;
  child: { id: string };
  type: 'plans' | 'children';
  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.child = JSON.parse(localStorage.getItem("children")!);
    if (window.location.href.includes("plans")) {
      this.type = "plans";
    } else {
        this.type = "children";
    }
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.attachmentForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      path: ["", Validators.required],
      attachable_id: [this.child.id],
      attachable_type: ["child"],
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

  saveAttachment() {
    this.loading = true;
    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    formData.append("path", this.selectedFile);
    formData.append("attachable_id", this.child.id);
    if (this.type === "plans") {
      formData.append("attachable_type", "child_plan");
    } else {
      formData.append("attachable_type", "child");
    }

    this.apiService.addAttachment(formData).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success(this.translate.instant("attachmentAddedSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }

}
