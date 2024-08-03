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
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  // child: any;
  // id: any;
  // name: any;
  // description: any;
  // path: any;
  // 
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
    // this.child = JSON.parse(localStorage.getItem("children")!);
    console.log("")
    this.attachment = JSON.parse(localStorage.getItem("oneAttachment")!);
    console.log("oneAttachment", this.attachment);
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    // this.getAttachment(this.name);
    this.attachmentForm = this.formBuilder.group({
      name: [this.attachment.name, [Validators.required]],
      description: [this.attachment.description, [Validators.required]],
      // attachable_id: [this.child.id],
      // attachable_type: ["child"],
    });
  }
  get f() {
    return this.attachmentForm.controls;
  }
  // getAttachment(id: any) {
  //   this.apiService.showAttachment(id).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.name = res.name;
  //       this.description = res.description;
  //       this.path = res.path;
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.log(error.message);
  //       this.cdr.detectChanges();
  //     }
  //   );
  // }
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
  removeAttachment(i: number) {
    const control = this.attachmentForm.controls.attachments as FormArray;
    control.removeAt(i);
  }
  addGaurd() {
    this.loading = true;
    console.log("Result: ", this.attachmentForm.value);
    const formData = new FormData();
    formData.append("name", this.f.name.value);
    formData.append("description", this.f.description.value);
    if (this.selectedFileNationalID) {
      formData.append("path", this.selectedFileNationalID);
    }
    console.log("formData", formData);
    // formData.append("attachable_id", this.child.id);
    // formData.append("attachable_type", "child");

    this.apiService.editAttachment(formData, this.attachment.id).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.toastr.success(this.translate.instant("attachmentEditSuccessfully"));
        this.activeModal.close();
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.error);
        this.loading = false;
        console.log(error.message);
        this.cdr.detectChanges();
      }
    );
  }

}
