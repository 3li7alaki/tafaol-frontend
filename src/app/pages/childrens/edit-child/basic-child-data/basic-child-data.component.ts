import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-basic-child-data",
  templateUrl: "./basic-child-data.component.html",
  styleUrl: "./basic-child-data.component.scss",
})
export class BasicChildDataComponent implements OnInit {
  id: any;
  children: any;
  childrenForm: FormGroup;
  nationalityList: any[];
  guardianList: any[];
  loading = false;
  selectedFile: File;
  imageUrl: string;
  selectedFileNationalID: File;
  imageUrlNationalID: string;

  myFiles: any[] = [];
  sMsg: string = "";

  constructor(
    private rout: ActivatedRoute,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.children = JSON.parse(localStorage.getItem("children")!);
    this.apiService.getOneChildData(this.children.id).subscribe(
      (res) => {
        localStorage.setItem('extraDetailsChild',JSON.stringify(res))
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
    this.apiService.getGaurdians().subscribe(
        (res) => {
          this.guardianList = res;
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        }
    );
  }
  ngOnInit(): void {
    this.initForm();
    this.apiService.getNationalites().subscribe(
      (res) => {
        
        this.nationalityList = res;
        this.cdr.detectChanges();
      },
      (error) => {
        
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
      }
    );
  }

  initForm() {
    this.childrenForm = this.formBuilder.group({
      full_name: [this.children.full_name, [Validators.required]],
      birth_date: [
        this.children.birth_date,
        [Validators.required, Validators.email],
      ],
      birth_place: [this.children.birth_place, [Validators.required]],
      gender: [this.children.gender, [Validators.required]],
      cpr: [this.children.cpr, [Validators.required]],
      other_number: [this.children.other_number, [Validators.required]],
      lives_with: [this.children.lives_with, [Validators.required]],
      guardian_relation: [
        this.children.guardian_relation,
        [Validators.required],
      ],
      ministry_registered: [
        this.children.ministry_registered,
        [Validators.required],
      ],
      other_center: [this.children.other_center, [Validators.required]],
      other_center_year: [
        this.children.other_center_year,
        [Validators.required],
      ],
      building: [this.children.building, [Validators.required]],
      street: [this.children.street, [Validators.required]],
      block: [this.children.block, [Validators.required]],
      area: [this.children.area, [Validators.required]],
      apartment: [this.children.apartment, [Validators.required]],
      age: [this.children.age, [Validators.required]],
      nationality_id: [this.children.nationality_id, [Validators.required]],
      guardian_id: [this.children.guardian_id, [Validators.required]],
    });
    this.imageUrl = this.children.photo;
    this.imageUrlNationalID = this.children.national_id;
    this.myFiles = this.children.attachments;
    this.f.age.disable();
  }
  get f() {
    return this.childrenForm.controls;
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
  onFileSelectedNational(event: any) {
    // Get the selected file from the event
    const file = event.target.files[0];
    this.selectedFileNationalID = file;
    // Create a FileReader object to read the file contents
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

  getFileDetails(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  editChild() {
    const formData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      const file = this.myFiles[i];

      if (file.path) {
      } else {
        formData.append(`attachments[${i}][name]`, file.name);
        formData.append(`attachments[${i}][path]`, file);
        formData.append(`attachments[${i}][description]`, ""); // Add description as needed
      }
    }

    // Log the FormData object to the console
    formData.append("full_name", this.f.full_name.value);
    formData.append(
      "birth_date",
      this.datePipe.transform(this.f.birth_date.value, "yyyy-MM-dd")!
    );
    formData.append("birth_place", this.f.birth_place.value);
    formData.append("gender", this.f.gender.value);
    formData.append("nationality_id", this.f.nationality_id.value);
    formData.append("guardian_id", this.f.guardian_id.value);
    if (this.selectedFile != null) {
      formData.append("photo", this.selectedFile);
    }
    if (this.selectedFileNationalID != null) {
      formData.append("national_id", this.selectedFileNationalID);
    }

    formData.append("other_number", this.f.other_number.value);
    formData.append("lives_with", this.f.lives_with.value);
    formData.append("guardian_relation", this.f.guardian_relation.value);
    formData.append(
      "ministry_registered",
      this.f.ministry_registered.value === true ? "1" : "0"
    );
    formData.append("other_center", this.f.other_center.value);
    formData.append("cpr", this.f.cpr.value);
    formData.append("other_center_year", this.f.other_center_year.value);
    formData.append("building", this.f.building.value);
    formData.append("street", this.f.street.value);
    formData.append("block", this.f.block.value);
    formData.append("area", this.f.area.value);
    formData.append("apartment", this.f.apartment.value);

    this.loading = true;
    
    this.apiService.editChildren(formData, this.children.id).subscribe(
      (res) => {
        this.loading = false;
        
        this.toastr.success(this.translate.instant("childEditedSuccessfully"));
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        
        this.cdr.detectChanges();
      }
    );
  };
  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
