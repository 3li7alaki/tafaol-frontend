import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-add-basic-child-data",
  templateUrl: "./add-basic-child-data.component.html",
  styleUrl: "./add-basic-child-data.component.scss",
})
export class AddBasicChildDataComponent implements OnInit {
  childrenForm: FormGroup;
  nationalityList: any[];
  guardianList: any[];
  loading = false;
  selectedFile: File;
  imageUrl: string;
  selectedFileNationalID: File;
  imageUrlNationalID: string;
  
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe
  ) {}
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

  initForm() {
    this.childrenForm = this.formBuilder.group({
      full_name: ["", [Validators.required]],
      birth_date: ["", [Validators.required, Validators.email]],
      birth_place: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      cpr: ["", [Validators.required]],
      other_number: ["", [Validators.required]],
      lives_with: ["", [Validators.required]],
      guardian_relation: ["", [Validators.required]],
      ministry_registered: [false, [Validators.required]],
      other_center: ["", [Validators.required]],
      other_center_year: ["", [Validators.required]],
      building: ["", [Validators.required]],
      street: ["", [Validators.required]],
      block: ["", [Validators.required]],
      area: ["", [Validators.required]],
      apartment: ["", [Validators.required]],
      nationality_id: [null, [Validators.required]],
      guardian_id: [null, [Validators.required]],
    });
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

  addChild() {
    const formData = new FormData();


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
    if (this.selectedFile) {
      formData.append("photo", this.selectedFile);
    }
    if (this.selectedFileNationalID) {
      formData.append("national_id", this.selectedFileNationalID);
    }
    formData.append("other_number", this.f.other_number.value);
    formData.append("lives_with", this.f.lives_with.value);
    formData.append("guardian_relation", this.f.guardian_relation.value);
    formData.append(
      "ministry_registered",
      this.f.ministry_registered.value === true ? "1" : "0"
    );
    formData.append("cpr", this.f.cpr.value);
    formData.append("other_center", this.f.other_center.value);
    formData.append("other_center_year", this.f.other_center_year.value);
    formData.append("building", this.f.building.value);
    formData.append("street", this.f.street.value);
    formData.append("block", this.f.block.value);
    formData.append("area", this.f.area.value);
    formData.append("apartment", this.f.apartment.value);

    this.loading = true;
    this.apiService.addChildren(formData).subscribe(
      (res) => {
        this.loading = false;
        this.toastr.success(this.translate.instant("childAddedSuccessfully"));
        this.router.navigate(["/apps/childrens/edit-child/"+res["id"]+"/diagnoses"]);
        this.cdr.detectChanges();
        localStorage.setItem('child', JSON.stringify(res))
      },
      (error) => {
        this.toastr.error(error.message ?? error.error.message ?? error.error ?? error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
